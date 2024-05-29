import type { UnpluginFactory } from "unplugin";
import type { Options, DoReplacer } from "./types";
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
import { cleanUrl, normalizeAbsolutePath } from "./core/util";
import { classNameTracker, selectorTracker } from "./core/tracker";

function generateFile(code: string, filename: string) {
  const filepath = path.resolve(
    process.cwd(),
    `./.tailwindcss-shortener/${filename}`
  );
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, code);
}

export const unpluginFactory: UnpluginFactory<Options> = (options = {}) => {
  let tailwindTranformedCode: string;
  let tailwindcssMap: Record<string, string>;
  let tailwindcssInput: string;
  let cssMap: Record<string, string>;

  if (!options.keyword) {
    options.keyword = { cva: true };
  }

  const doReplacer: DoReplacer = generateReplacer(
    (v: string) => tailwindcssMap[v] ?? v
  );
  const filter = createFilter(
    options.include || [
      /\.vue$/,
      /\.[jt]sx?$/,
      /tailwind.css$/,
      /^twst:css-map$/,
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
      cssMap = genCSSMap(options.keyword);
      const tailwindConfig = path.resolve(
        process.cwd(),
        options.tailwindConfig ?? "./tailwind.config.js"
      );
      tailwindcssInput = path.resolve(
        process.cwd(),
        options.tailwindCSS ?? "./src/tailwind.css"
      );

      const tailwindCodeUint8Array = execSync(
        `npx tailwindcss -c ${tailwindConfig} -i ${tailwindcssInput}`
      );
      const textDecoder = new TextDecoder("utf-8");
      const tailwindCode = textDecoder.decode(tailwindCodeUint8Array);

      const [_tailwindTransformedCode, usedSet] = cssReplacer(
        tailwindCode,
        cssMap
      );
      tailwindTranformedCode = _tailwindTransformedCode;
      tailwindcssMap = {};

      [...usedSet.values()].forEach((key) => {
        tailwindcssMap[key] = cssMap[key];
      });

      if (options.output) {
        generateFile(tailwindCode, "tailwind.css");
        generateFile(JSON.stringify(cssMap, null, 2), "cssMap.json");
      }
    },
    resolveId(id) {
      if (id === "twst:css-map") {
        return id;
      }
      return null;
    },
    loadInclude(id: string) {
      if (tailwindcssInput && normalizeAbsolutePath(id) === normalizeAbsolutePath(tailwindcssInput))
        return true;
      if (id.includes("?")) return false;
      return filter(id);
    },
    load(_id) {
      // in webpack, there are Vue sub requests. If only the main request is handled, then the code won't be transformed
      const id = cleanUrl(_id);
      try {
        if (/\.vue$/.test(id)) {
          const code = fs.readFileSync(id, { encoding: "utf-8" });
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
            const code = templateReplacer(
              template.content,
              doReplacer,
              options.keyword
            );
            const attriutesStr = stringifyAttrs(template.attrs);
            transformedTemplateCode = `<template ${attriutesStr}>${code}</template>`;
          }

          if (script) {
            const code = jsReplacer(
              script.content,
              doReplacer,
              options.keyword
            );
            const attriutesStr = stringifyAttrs(script.attrs);
            transformedScriptCode = `<script ${attriutesStr}>${code}</script>`;
          }

          if (scriptSetup) {
            const code = jsReplacer(
              scriptSetup.content,
              doReplacer,
              options.keyword
            );
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
        if (/\.[jt]sx?$/.test(id)) {
          const code = fs.readFileSync(id, { encoding: "utf-8" });
          const transformedCode = jsReplacer(code, doReplacer, options.keyword);
          return transformedCode;
        }
        if (
          normalizeAbsolutePath(tailwindcssInput) === normalizeAbsolutePath(id)
        ) {
          if (options.output) {
            generateFile(tailwindTranformedCode, "transform-tailwind.css");
          }
          return tailwindTranformedCode;
        }
        if (id === "twst:css-map") {
          return `export default ${JSON.stringify(cssMap, null, 2)};`;
        }
        return null;
      } catch (error) {
        console.error(id);
        console.error(error);
      }
    },
    writeBundle() {
      classNameTracker.print();
      selectorTracker.print();
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
