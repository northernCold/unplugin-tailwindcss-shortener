import type { DoReplacer } from '../../types';
import jsReplacer from './js-replacer';

// (\s|^) 是防止 :rule-class="RuleClassValueEnum.ABNORMAL_OPERATION"
const staticClassNameRegExp = /(?<=\s|^)class\s*=\s*"([^"]*)"/gm;
const dynamicClassNameRegExp = /(?<=:)class\s*=\s*"([^"]*)"/gm;

export default function replacer(code: string, doReplacer: DoReplacer) {
  let transformedCode = code.replace(staticClassNameRegExp, function (matched, $1) {
    return `class="${doReplacer($1)}"`;
  });

  transformedCode = transformedCode.replace(dynamicClassNameRegExp, function (matched, $1) {
    return `class="${jsReplacer($1, doReplacer).replace(/"/g, "'").replace(/;/, '')}"`;
  });
  return transformedCode;
}
