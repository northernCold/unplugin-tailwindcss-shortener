export const generateReplacer =
  (callback: (className: string) => unknown) => (classNames: string) => {
    return classNames
      .split(" ")
      .filter((className) => className)
      .map((className) => callback(className))
      .join(" ");
  };

const postfixRE = /[?#].*$/;
export function cleanUrl(url: string): string {
  return url.replace(postfixRE, "");
}
