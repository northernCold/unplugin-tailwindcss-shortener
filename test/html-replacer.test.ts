import type { DoReplacer } from "../src/types";
import replacer from "../src/core/replacer/html-replacer";
import { it, describe, expect } from "vitest";
import { generateReplacer } from "../src/core/util";

const doReplacer: DoReplacer = generateReplacer(
  (className) => className + "-replaced"
);
describe("replacer", () => {
  it("should replace class names", () => {
    const code = '<div class="foo bar">Hello</div>';
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(
      '<div class="foo-replaced bar-replaced">Hello</div>'
    );
  });

  it("should handle multiple class names", () => {
    const code = '<div class="foo bar baz">Hello</div>';
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(
      '<div class="foo-replaced bar-replaced baz-replaced">Hello</div>'
    );
  });

  it("should handle no class attribute", () => {
    const code = "<div>Hello</div>";
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe("<div>Hello</div>");
  });

  it("should handle empty class attribute", () => {
    const code = '<div class="">Hello</div>';
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe('<div class="">Hello</div>');
  });

  it("should handle whitespace in class attribute", () => {
    const code = '<div class="foo   bar">Hello</div>';
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(
      '<div class="foo-replaced bar-replaced">Hello</div>'
    );
  });

  it("should handle special characters in class names", () => {
    const code = '<div class="foo.bar[baz]">Hello</div>';
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(
      '<div class="foo.bar[baz]-replaced">Hello</div>'
    );
  });
});
