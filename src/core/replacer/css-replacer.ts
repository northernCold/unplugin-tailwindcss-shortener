import type { CSSMap } from "../../types";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { selectorTracker } from "../tracker";

export default function replacer(code: string, cssMap: CSSMap): [string, Set<string>] {
  const usedSet: Set<string> = new Set();
  const root = postcss.parse(code);

  const selectorProcessor = selectorParser((selectors) => {
    selectors.walkClasses((node) => {
      if (cssMap[node.value]) {
        usedSet.add(node.value);
        selectorTracker.add(node.value, cssMap[node.value]);
        node.value = cssMap[node.value];
      }
    });
  });

  root.walkRules((ruleNode) => {
    ruleNode.selector = selectorProcessor.processSync(ruleNode);
  });

  const transformedCode = root.toString();

  return [transformedCode, usedSet];
}
