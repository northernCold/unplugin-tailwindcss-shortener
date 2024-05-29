import type { DoReplacer, Options } from '../../types';
import jsReplacer from './js-replacer';

// 不适用 html parser 的原因
// 无法处理自定义组件 自闭合 =》 <div><p/>123</div> =>
// vue 本身的 generate 是生成编译后的代码

// (\s|^) 是防止 :rule-class="RuleClassValueEnum.ABNORMAL_OPERATION"
const staticClassNameRegExp = /(?<=\s|^)class\s*=\s*"([^"]*)"/gm;
const dynamicClassNameRegExp = /(?<=:)class\s*=\s*"([^"]*)"/gm;

export default function replacer(code: string, doReplacer: DoReplacer, keyword: Options['keyword']) {
  let transformedCode = code.replace(staticClassNameRegExp, function (matched, $1) {
    return `class="${doReplacer($1)}"`;
  });

  transformedCode = transformedCode.replace(dynamicClassNameRegExp, function (matched, $1) {
    return `class="${jsReplacer($1, doReplacer, keyword)!.replace(/"/g, "'").replace(/;/, '')}"`;
  });
  return transformedCode;
}
