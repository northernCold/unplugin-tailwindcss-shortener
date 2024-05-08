import type { DoReplacer, Options } from "../../types";
import fg from "fast-glob";
import path from "path";
import fs from "fs";
import { CssShortener } from "css-shortener";
import { parse } from "vue/compiler-sfc";
import jsReplacer from "../replacer/js-replacer";
import templateReplacer from "../replacer/template-replacer";
import htmlReplacer from "../replacer/html-replacer";
import { generateReplacer } from "../util";

const cssShortener = new CssShortener();

const doReplacer: DoReplacer = generateReplacer((className) =>
  cssShortener.shortenClassName(className)
);
export function genCSSMap(keyword: Options['keyword']) {
  const files = fg.sync(["**/*.{jsx,tsx,vue,html,ts,js}", "!node_modules"]);
  for (let file of files) {
    try {
      const ext = path.extname(file);
      const code = fs.readFileSync(file, { encoding: "utf-8" });

      if (ext === ".vue") {
        const {
          descriptor: { template, script, scriptSetup, styles },
        } = parse(code);
        if (template) {
          templateReplacer(template.content, doReplacer, keyword);
        }
        if (script) {
          jsReplacer(script.content, doReplacer, keyword);
        }

        if (scriptSetup) {
          jsReplacer(scriptSetup.content, doReplacer, keyword);
        }
      }

      if (ext === ".jsx" || ext === ".tsx" || ext === '.ts' || ext === '.js') {
        jsReplacer(code, doReplacer, keyword);
      }

      if (ext === ".html") {
        htmlReplacer(code, doReplacer);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return cssShortener.map;
}
