export interface Options {
  // define your plugin options here
}

export type CSSMap = Record<string, string>;

export type DoReplacer = (className: string) => string;