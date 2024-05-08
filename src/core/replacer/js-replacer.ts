import type { DoReplacer, Options } from "../../types";
import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";

// Babel is a CJS package and uses `default` as named binding (`exports.default =`).
// https://github.com/babel/babel/issues/15269.
const traverse = ((_traverse as any)["default"] ??
  _traverse) as typeof _traverse;
const generate = ((_generate as any)["default"] ??
  _generate) as typeof _generate;
function transform(ast: t.Node, doReplacer: DoReplacer, keyword: Options['keyword']) {
  function replaceStrings(
    node:
      | t.ConditionalExpression
      | t.StringLiteral
      | t.LogicalExpression
      | t.Expression
  ):
    | t.ConditionalExpression
    | t.StringLiteral
    | t.LogicalExpression
    | t.Expression {
    if (t.isStringLiteral(node)) {
      return t.stringLiteral(doReplacer(node.value));
    } else if (t.isConditionalExpression(node)) {
      return t.conditionalExpression(
        replaceStrings(node.test),
        replaceStrings(node.consequent),
        replaceStrings(node.alternate)
      );
    } else if (t.isLogicalExpression(node)) {
      return t.logicalExpression(
        node.operator,
        node.left,
        replaceStrings(node.right)
      );
    }
    return node;
  }
  function isKeyword(value: string) {
    if (keyword!.cva && value === 'cx') {
      return true;
    }

    if (keyword?.extra) {
      if (typeof keyword.extra === 'string') {
        return value === keyword.extra;
      }
      if (Array.isArray(keyword.extra)) {
        return keyword.extra.includes(value);
      }
    }

    return false;
  }

  traverse(ast, {
    JSXAttribute(path: NodePath<t.JSXAttribute>) {
      if (
        path.get("name").isJSXIdentifier({ name: "class" }) ||
        path.get("name").isJSXIdentifier({ name: "className" })
      ) {
        const valuePath = path.get("value");
        if ((valuePath.node as t.StringLiteral).value) {
          valuePath.replaceWith(
            t.stringLiteral(
              doReplacer((valuePath.node as t.StringLiteral).value)
            )
          );
        }
      }
    },
    CallExpression(path: NodePath<t.CallExpression>) {
      const callee = path.get("callee");

      if (callee.isIdentifier() && isKeyword(callee.node.name)) {
        const args = path.get("arguments");
        args.forEach((arg) => {
          const replacedStr = replaceStrings(arg.node as t.Expression);

          if (replacedStr) {
            arg.replaceWith(replacedStr);
          }
        });
      }

      if (callee.isIdentifier() && callee.node.name === "cva" && keyword?.cva) {
        const args = path.get("arguments");
        args.forEach((arg) => {
          if (arg.isStringLiteral()) {
            arg.replaceWith(t.stringLiteral(doReplacer(arg.node.value)));
          }
          if (arg.isArrayExpression()) {
            arg.get("elements").forEach((element) => {
              if (element.isStringLiteral()) {
                element.replaceWith(
                  t.stringLiteral(doReplacer(element.node.value))
                );
              }
            });
          }
          if (arg.isObjectExpression()) {
            arg.get("properties").forEach((property) => {
              if (property.isObjectProperty()) {
                if ((property.node.key as t.Identifier).name === "variants") {
                  const variantsObject = property.get("value");
                  (variantsObject.get("properties") as NodePath[]).forEach(
                    (variantProperty: NodePath) => {
                      const variantValue = variantProperty.get("value");
                      if (
                        (
                          variantValue as NodePath<t.ObjectExpression>
                        ).isObjectExpression()
                      ) {
                        (variantValue as NodePath<t.ObjectExpression>)
                          .get("properties")
                          .forEach((innerProperty) => {
                            const innerValue = innerProperty.get("value");
                            if (
                              (
                                innerValue as NodePath<t.StringLiteral>
                              ).isStringLiteral()
                            ) {
                              (
                                innerValue as NodePath<t.StringLiteral>
                              ).replaceWith(
                                t.stringLiteral(
                                  doReplacer(
                                    (innerValue as NodePath<t.StringLiteral>)
                                      .node.value
                                  )
                                )
                              );
                            } else if (
                              (
                                innerValue as NodePath<t.ArrayExpression>
                              ).isArrayExpression()
                            ) {
                              (innerValue as NodePath<t.ArrayExpression>)
                                .get("elements")
                                .forEach((element) => {
                                  if (element.isStringLiteral()) {
                                    element.replaceWith(
                                      t.stringLiteral(
                                        doReplacer(element.node.value)
                                      )
                                    );
                                  }
                                });
                            }
                          });
                      } else if (
                        (
                          variantValue as NodePath<t.ArrayExpression>
                        ).isArrayExpression()
                      ) {
                        (variantValue as NodePath<t.ArrayExpression>)
                          .get("elements")
                          .forEach((element) => {
                            if (element.isStringLiteral()) {
                              element.replaceWith(
                                t.stringLiteral(doReplacer(element.node.value))
                              );
                            }
                          });
                      }
                    }
                  );
                }
                if (
                  (property.node.key as t.Identifier).name ===
                  "compoundVariants"
                ) {
                  const compoundVariantsObject = property.get("value");
                  (compoundVariantsObject as NodePath<t.ArrayExpression>)
                    .get("elements")
                    .forEach((compoundVariantsProp) => {
                      (compoundVariantsProp as NodePath<t.ObjectExpression>)
                        .get("properties")
                        .forEach((prop) => {
                          if (
                            (
                              (prop.node as t.ObjectProperty)
                                .key as t.Identifier
                            ).name === "class"
                          ) {
                            const classValue = prop.get("value");
                            if (
                              (
                                classValue as NodePath<t.StringLiteral>
                              ).isStringLiteral()
                            ) {
                              (
                                classValue as NodePath<t.StringLiteral>
                              ).replaceWith(
                                t.stringLiteral(
                                  doReplacer(
                                    (classValue as NodePath<t.StringLiteral>)
                                      .node.value
                                  )
                                )
                              );
                            }
                          }
                        });
                    });
                }
              }
            });
          }
        });
      }
    },
  });
}

export default function replacer(code: string, doReplacer: DoReplacer, keyword: Options['keyword']) {
  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
    transform(ast, doReplacer, keyword);
  
    const { code: transformedCode } = generate(ast);
  
    return transformedCode;
  } catch (error) {
    console.error(error);  
  }
}
