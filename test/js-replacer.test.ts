import type { DoReplacer } from "../src/types";
import replacer from "../src/core/replacer/js-replacer";
import { it, describe, expect } from "vitest";
import { generateReplacer } from "../src/core/util";

const doReplacer: DoReplacer = generateReplacer(
  (className) => className + "-replaced"
);

describe("replacer function", () => {
  it("should replace string literals in JSX attributes", () => {
    const code = `function App() {
  return (
<div>
<div className="foo" />
<div class="bar" />
</div>
  )
}`;
    const expected = `function App() {
  return <div>
    <div className="foo-replaced" />
    <div class="bar-replaced" />
  </div>;
}`;
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(expected);
  });

  it("should replace string literals in cx calls", () => {
    const code = `
      import cx from 'classnames';
      const className = cx('foo', 'bar');
    `;
    const expected = `import cx from 'classnames';
const className = cx("foo-replaced", "bar-replaced");`;
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(expected);
  });

  it("should replace string literals in cva calls", () => {
    const code = `
      import cva from 'class-variance-authority';
      const styles = cva('foo', 'bar');
    `;
    const expected = `import cva from 'class-variance-authority';
const styles = cva("foo-replaced", "bar-replaced");`;
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(expected);
  });

  // 请实现一个单元测试 cx 函数里包裹三目运算 classNames 的情况
  it("should replace string literals in cx calls with ternary operator", () => {
    const code = `const code = cx(open ? 'block' : 'hidden')`;
    const expected = `const code = cx(open ? "block-replaced" : "hidden-replaced");`;

    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(expected);
  });

  it("should replace string literals in object expressions", () => {
    const code = `
      const styles = cva('base', {
        variants: {
          color: {
            primary: ['foo', 'bar'],
            secondary: ['baz', 'qux'],
          },
          size: {
            small: ['p-2', 'm-2'],
            default: ['p-4', 'm-4'],
          },
        },
        compoundVariants: [
          {
            intent: 'primary',
            size: 'small',
            class: 'compound',
          },
        ],
      });
    `;
    const expected = `const styles = cva("base-replaced", {
  variants: {
    color: {
      primary: ["foo-replaced", "bar-replaced"],
      secondary: ["baz-replaced", "qux-replaced"]
    },
    size: {
      small: ["p-2-replaced", "m-2-replaced"],
      default: ["p-4-replaced", "m-4-replaced"]
    }
  },
  compoundVariants: [{
    intent: 'primary',
    size: 'small',
    class: "compound-replaced"
  }]
});`;
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(expected);
  });

  it("should replace string literals in object expressions", () => {
    const code = `
      const styles = cva(['flex', 'p-2'], {
        variants: {
          color: {
            primary: ['foo', 'bar'],
            secondary: ['baz', 'qux'],
          },
          size: {
            small: ['p-2', 'm-2'],
            default: ['p-4', 'm-4'],
          },
          shadow: {
            md: "drop-shadow-md",
            lg: "drop-shadow-lg",
            xl: "drop-shadow-xl",
          }
        },
        compoundVariants: [
          {
            intent: 'primary',
            size: 'small',
            class: 'compound',
          },
        ],
      });
    `;
    const expected = `const styles = cva(["flex-replaced", "p-2-replaced"], {
  variants: {
    color: {
      primary: ["foo-replaced", "bar-replaced"],
      secondary: ["baz-replaced", "qux-replaced"]
    },
    size: {
      small: ["p-2-replaced", "m-2-replaced"],
      default: ["p-4-replaced", "m-4-replaced"]
    },
    shadow: {
      md: "drop-shadow-md-replaced",
      lg: "drop-shadow-lg-replaced",
      xl: "drop-shadow-xl-replaced"
    }
  },
  compoundVariants: [{
    intent: 'primary',
    size: 'small',
    class: "compound-replaced"
  }]
});`;
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(expected);
  });
  // nesting cx 的情况
  it("should replace string literals in nested cx calls", () => {
    const code = `
      import cx from 'classnames';
      const className = cx('foo', cx('bar', 'baz'));
    `;
    const expected = `import cx from 'classnames';
const className = cx("foo-replaced", cx("bar-replaced", "baz-replaced"));`;
    const transformedCode = replacer(code, doReplacer);

    expect(transformedCode).toBe(expected);
  });

  // the situation of nesting cx with variable
  it("should replace string literals in nested cx calls with variable", () => {
    const code = `
      import cx from 'classnames';
      const className1 = cx('foo', cx('bar', 'baz'), 'qux');
      const className2 = cx('foo', className1, 'qux');
    `;
    const expected = `import cx from 'classnames';
const className1 = cx("foo-replaced", cx("bar-replaced", "baz-replaced"), "qux-replaced");
const className2 = cx("foo-replaced", className1, "qux-replaced");`;

    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(expected);
  });

  // the situation of cva and cx combine
  it("should replace string literals in cva and cx calls", () => {
    const code = `
      import cx from 'classnames';
      import cva from 'class-variance-authority';
      const className = cx('foo', cva('bar', 'baz'), 'qux');
    `;
    const expected = `import cx from 'classnames';
import cva from 'class-variance-authority';
const className = cx("foo-replaced", cva("bar-replaced", "baz-replaced"), "qux-replaced");`;
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(expected);
  });

  // the situation of logical expression with class in cx
  it("should replace string literals in logical expression with class in cx", () => {
    const code = `
      import cx from 'classnames';
      const className = cx('foo', 'bar' && 'baz');`;
    const expected = `import cx from 'classnames';
const className = cx("foo-replaced", 'bar' && "baz-replaced");`;
    const transformedCode = replacer(code, doReplacer);

    expect(transformedCode).toBe(expected);
  });

  // the situation of cx nesting cva
  it("should replace string literals in cx nesting cva", () => {
    const code = `
      import cx from 'classnames';
      import cva from 'class-variance-authority';
      const classNameVariant = cva('bar', 'baz');
      const className = cx('foo', classNameVariant(), 'qux');
    `;
    const expected = `import cx from 'classnames';
import cva from 'class-variance-authority';
const classNameVariant = cva("bar-replaced", "baz-replaced");
const className = cx("foo-replaced", classNameVariant(), "qux-replaced");`;
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(expected);
  });

  // cx 的参数使用 ` 的包裹的情况
  it("should replace string literals in cx cva with `", () => {
    const code = `
      import cx from 'classnames';
      const className = cx(\`foo\`);
    `;
    const expected = `import cx from 'classnames';
const className = cx("foo-replaced");`;
    const transformedCode = replacer(code, doReplacer);
    expect(transformedCode).toBe(expected);
  });
});
