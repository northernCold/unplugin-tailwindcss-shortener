import { isAbsolute, normalize } from "path";
import { classNameTracker } from "./tracker";

/**
 * Normalizes a given path when it's absolute. Normalizing means returning a new path by converting
 * the input path to the native os format. This is useful in cases where we want to normalize
 * the `id` argument of a hook. Any absolute ids should be in the default format
 * of the operating system. Any relative imports or node_module imports should remain
 * untouched.
 *
 * @param path - Path to normalize.
 * @returns a new normalized path.
 */
export function normalizeAbsolutePath(path: string) {
  if (isAbsolute(path)) return normalize(path);
  else return path;
}

export const generateReplacer =
  (callback: (className: string) => unknown) => (classNames: string) => {
    const result = classNames
      .split(" ")
      .filter((className) => className)
      .map((className) => callback(className))
      .join(" ");

    classNameTracker.add(classNames, result);
    return result;
  };

const postfixRE = /[?#].*$/;
export function cleanUrl(url: string): string {
  return url.replace(postfixRE, "");
}
