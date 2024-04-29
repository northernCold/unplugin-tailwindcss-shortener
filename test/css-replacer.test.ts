import type { CSSMap } from "../src/types";
import { it, describe, expect } from "vitest";
import replacer from "../src/core/replacer/css-replacer";

describe('replacer function', () => {
  it('should replace class names based on the CSSMap and collect used classes', async () => {
    const code = `.oldClass1 {
  color: red;
}
.oldClass2 {
  background-color: blue;
}
div .oldClass3 {
  font-size: 16px;
}`;
    const cssMap: CSSMap = {
      oldClass1: 'newClass1',
      oldClass3: 'newClass3',
    };

    const [transformedCode, usedSet] = replacer(code, cssMap);

    // 验证类名被正确替换
    expect(transformedCode).toContain('.newClass1');
    expect(transformedCode).toContain('.oldClass2'); // 这个没有替换，用于验证只替换映射中存在的类
    expect(transformedCode).toContain('.newClass3');

    // 验证 usedSet 收集了正确的类名
    expect(usedSet.has('oldClass1')).toBe(true);
    expect(usedSet.has('oldClass2')).toBe(false); // 不在映射中的类不应被收集
    expect(usedSet.has('oldClass3')).toBe(true);

    // 可以进一步验证 transformedCode 的其他方面，如整体结构是否保持不变等
    const expected = `.newClass1 {
  color: red;
}
.oldClass2 {
  background-color: blue;
}
div .newClass3 {
  font-size: 16px;
}`;
    expect(transformedCode).toBe(expected);
  });

  // 添加更多测试用例来覆盖边缘情况，比如空 CSSMap、没有匹配的类名、特殊字符等
});