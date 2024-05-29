import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cssMap = import.meta.env.TWST_CSS_MAP ?? {};
console.log(cssMap);
const shortToOriginMap = new Map<string, string>(Object.entries(cssMap))
const originToShortMap = new Map<string, string>(
  Object.entries(cssMap).map(([k, v]) => [v, k])
)

export function cn(...inputs: ClassValue[]) {
  const classnames = clsx(inputs)
  const before = classnames
    .split(' ')
    .map((classname) => {
      const short = originToShortMap.get(classname)
      if (short) {
        return short
      }
      return classname
    })
    .join(' ')

  const merged = twMerge(before);

  const after = merged
    .split(' ')
    .map((classname) => {
      const short = shortToOriginMap.get(classname)
      if (short) {
        return short
      }
      return classname
    })
    .join(' ')

    return after
}
