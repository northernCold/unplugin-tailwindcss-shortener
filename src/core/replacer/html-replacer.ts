import type { DoReplacer } from "../../types";
import type { ChildNode, Document, Element } from "domhandler";
import * as parser from "htmlparser2";
import generate from "htmlparser-to-html";

generate.configure({ disableAttribEscape: true });

function transform(ast: Document, doReplacer: DoReplacer) {
  function traverse(root: ChildNode) {
    const attrs = (root as Element).attribs;
    if (attrs) {
      const className = attrs.class;
      if (className) {
        (root as Element).attribs["class"] = doReplacer(className);
      }
    }
    (root as Document)?.children?.forEach((child) => {
      traverse(child);
    });
  }
  traverse(ast);
}

export default function replacer(code: string, doReplacer: DoReplacer) {
  const ast = parser.parseDocument(code);

  transform(ast, doReplacer);

  const transformedCode = generate(ast.children);

  return transformedCode;
}
