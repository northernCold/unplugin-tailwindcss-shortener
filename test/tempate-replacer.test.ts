import type { DoReplacer } from "../src/types";
import replacer from "../src/core/replacer/template-replacer";
import { it, describe, expect } from "vitest";
import { generateReplacer } from "../src/core/util";

const doReplacer: DoReplacer = generateReplacer(
  (className) => className + "-replaced"
);

describe('replacer function', () => {
  it('should replace static class names correctly', () => {
    const code = '<div class="originalStaticClass"></div>';
    const expectedResult = '<div class="originalStaticClass-replaced"></div>';
    const result = replacer(code, doReplacer);
    expect(result).to.equal(expectedResult);
  });

  it('should replace dynamic class names correctly', () => {
    // Assuming jsReplacer behaves as expected; adjust if jsReplacer logic is different.
    const code = '<div :class="dynamicClass"></div>';
    const expectedResult = '<div :class="dynamicClass"></div>';
    const result = replacer(code, doReplacer);
    expect(result).to.equal(expectedResult);
  });

  it('should handle multiple class names correctly', () => {
    const code = '<div class="class1 class2"></div>';
    const expectedResult = '<div class="class1-replaced class2-replaced"></div>';
    const result = replacer(code, doReplacer);
    expect(result).to.equal(expectedResult);
  });

  it('should not alter non-class attributes', () => {
    const code = '<div id="someId" class="anotherClass"></div>';
    // Assuming "anotherClass" would be replaced, only verifying non-class attribute preservation.
    const expectedResultContains = '<div id="someId" class="anotherClass-replaced"></div>';
    const result = replacer(code, doReplacer);
    expect(result).to.include(expectedResultContains);
  });

  // cx(`absolute inset-0 bg-${u.statusColor}-200 opacity-50 rounded-full`)
  // Add more edge cases and scenarios as needed to fully test the function.
});