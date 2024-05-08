export interface Options {
  /**
   * @default [/\.vue$/, /\.[jt]sx?$/, /tailwind.css$/]
   */
  include?: RegExp[];
  /**
   * @default [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/]
   */
  exclude?: RegExp[];
  /**
   * @default './tailwind.config.js'
   */
  tailwindConfig?: string;
  /**
   * @default './src/tailwind.css'
   */
  tailwindCSS?: string;
  /**
   * @default 'build'
   * webpack don't support this
   */
  apply?: "build" | "serve";
  /**
   * @default false
   * Information for debugging
   * - /.tailwindcss-shortener
   *  - tailwind.css (The generated CSS file from Tailwind CSS.)
   *  - cssMap.json (Mapping of original class names to shortened class names)
   */
  output?: boolean;
  /**
   * @default { cva: true } 
   * cva: whether to replace keyword 'cx' 'cva'
   * extra: additional keywords to replace
   */
  keyword?: {
    cva: boolean,
    extra?: string | string[],
  }
};

export type CSSMap = Record<string, string>;

export type DoReplacer = (className: string) => string;