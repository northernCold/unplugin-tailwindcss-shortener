import type { UnpluginFactory } from "unplugin";
import type { CSSMap, DoReplacer } from "./types";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { createUnplugin } from "unplugin";
import { genCSSMap } from "./core/css-map/vue";
import cssReplacer from "./core/replacer/css-replacer";
import templateReplacer from "./core/replacer/template-replacer";
import jsReplacer from "./core/replacer/js-replacer";
import { parse } from "vue/compiler-sfc";
import { generateReplacer } from "./core/util";
import replacer from "./core/replacer/html-replacer";
import { createFilter } from "@rollup/pluginutils";
import { cleanUrl } from "./core/util";

type UserOptions = {
  /**
   * @default [/\.vue$/, /\.vue\?vue/, /\.vue\?v=/, /\.[jt]sx?$/]
   */
  include?: string[];
  /**
   * @default [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/]
   */
  exclude?: string[];
  tailwindConfig?: string;
  tailwindCSS?: string;
  cwd?: string;
  /**
   * @default 'build'
   * webpack don't support this
   */
  apply?: "build" | "serve";
  /**
   * @default false
   */
  output?: boolean;
};

function generateFile(code: string, filename: string) {
  const filepath = path.resolve(
    process.cwd(),
    `./.tailwindcss-shortener/${filename}`
  );
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, code);
}

export const unpluginFactory: UnpluginFactory<UserOptions> = (options = {}) => {
  let tailwindTranformedCode: string;
  let tailwindcssMap: Record<string, string>;

  const doReplacer: DoReplacer = generateReplacer(
    (v: string) => tailwindcssMap[v] ?? v
  );
  const filter = createFilter(
    options.include || [
      /\.vue$/,
      /\.vue\?vue/,
      /\.vue\?v=/,
      /\.[jt]sx?$/,
      /tailwind.css$/,
    ],
    options.exclude || [
      /[\\/]node_modules[\\/]/,
      /[\\/]\.git[\\/]/,
      /[\\/]\.nuxt[\\/]/,
    ]
  );
  return {
    name: "unplugin-tailwindcss-shortener",
    enforce: "pre",
    buildStart() {
      const cssMap = genCSSMap();
      const tailwindConfig =
        options.tailwindConfig ??
        path.resolve(process.cwd(), "./tailwind.config.js");
      const input =
        options.tailwindCSS ??
        path.resolve(process.cwd(), "./src/tailwind.css");

      const tailwindCodeUint8Array = execSync(
        `npx tailwindcss -c ${tailwindConfig} -i ${input}`
      );
      const textDecoder = new TextDecoder("utf-8");
      const tailwindCode = textDecoder.decode(tailwindCodeUint8Array);

      if (options.output) {
        generateFile(tailwindCode, "tailwind.css");
        generateFile(JSON.stringify(cssMap, null, 2), "cssMap.json");
      }

      const [_tailwindTransformedCode, usedSet] = cssReplacer(
        tailwindCode,
        cssMap
      );
      tailwindTranformedCode = _tailwindTransformedCode;
      tailwindcssMap = {};

      [...usedSet.values()].forEach((key) => {
        tailwindcssMap[key] = cssMap[key];
      });
    },
    loadInclude(id: string) {
      if (options.apply === "serve") {
        return false;
      }
      const file = cleanUrl(id);
      return filter(file);
    },
    load(id) {
      const file = cleanUrl(id);
      try {
        if (/.vue$/.test(file)) {
          const code = fs.readFileSync(file, { encoding: "utf-8" });
          const {
            descriptor: { template, script, scriptSetup, styles },
          } = parse(code);

          const stringifyAttrs = (attrs: Record<string, any>) =>
            Object.keys(attrs)
              .map((key) => {
                if (typeof attrs[key] === "boolean") {
                  return key;
                } else {
                  return `${key}=${attrs[key]}`;
                }
              })
              .join(" ");
          let transformedTemplateCode;
          let transformedScriptCode;
          let transformedScriptSetupCode;
          let transformedStylesCode;

          if (template) {
            const code = templateReplacer(template.content, doReplacer);
            const attriutesStr = stringifyAttrs(template.attrs);
            transformedTemplateCode = `<template ${attriutesStr}>${code}</template>`;
          }

          if (script) {
            const code = jsReplacer(script.content, doReplacer);
            const attriutesStr = stringifyAttrs(script.attrs);
            transformedScriptCode = `<script ${attriutesStr}>${code}</script>`;
          }

          if (scriptSetup) {
            const code = jsReplacer(scriptSetup.content, doReplacer);
            const attriutesStr = stringifyAttrs(scriptSetup.attrs);
            transformedScriptSetupCode = `<script ${attriutesStr}>${code}</script>`;
          }

          if (styles) {
            transformedStylesCode = styles.map((style) => {
              const attriutesStr = stringifyAttrs(style.attrs);
              return `<style ${attriutesStr}>${style.content}</style>`;
            });
          }

          const transformedCode = [
            transformedTemplateCode,
            transformedScriptCode,
            transformedScriptSetupCode,
            transformedStylesCode,
          ]
            .filter((v) => v)
            .join("\n");

          return transformedCode;
        }
        if (/.[jt]sx?$/.test(file)) {
          const code = fs.readFileSync(file, { encoding: "utf-8" });
          const transformedCode = jsReplacer(code, doReplacer);
          return transformedCode;
        }
        if (/tailwind\.css$/.test(file)) {
          return tailwindTranformedCode;
        }
      } catch (error) {
        console.error(file);
        console.error(error);
      }
    },
    vite: {
      apply: options.apply,
      transformIndexHtml(html) {
        return replacer(html, doReplacer);
      },
    },
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
