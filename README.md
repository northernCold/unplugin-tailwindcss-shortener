# unplugin-tailwindcss-shortener

[![NPM version](https://img.shields.io/npm/v/unplugin-tailwindcss-shortener?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-tailwindcss-shortener)

[zh-CN](./README-zh.md)

Shorten the classes of Tailwind CSS

- Support Vue and React (TODO)
- Support Vite、Vue Cli and Webpack

HTML
```html
<!-- before -->
<div class="flex items-center justify-center h-screen px-6 bg-gray-200"></div>
<!-- after -->
<div class="h u bu i s j"></div>
```

JavaScrip

```js
// before
import { cx } from 'class-variance-authority';

const boxClass = cx('flex items-center justify-center h-screen px-6 bg-gray-200');

// after
import { cx } from 'class-variance-authority';

const boxClass = cx('h u bu i s j');
```

<details>
<summary>CSS</summary><br>

```css
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.bg-gray-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity));
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.h-screen {
  height: 100vh;
}

.flex {
    display: flex;
}

/* after */
.s {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.j {
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity));
}

.bu {
  justify-content: center;
}

.u {
  align-items: center;
}

.i {
  height: 100vh;
}

.h {
  display: flex;
}
```

<br></details>
## Install

```bash
npm i unplugin-tailwindcss-shortener
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import TailwindcssShortener from 'unplugin-tailwindcss-shortener/vite'

export default defineConfig({
  plugins: [
    TailwindcssShortener({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import TailwindcssShortener from 'unplugin-tailwindcss-shortener/rollup'

export default {
  plugins: [
    TailwindcssShortener({ /* options */ }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-tailwindcss-shortener/webpack').default({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['unplugin-tailwindcss-shortener/nuxt', { /* options */ }],
  ],
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-tailwindcss-shortener/webpack').default({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import TailwindcssShortener from 'unplugin-tailwindcss-shortener/esbuild'

build({
  plugins: [TailwindcssShortener()],
})
```

<br></details>


## Usage

If your project not only uses static class names but also dynamic class names, you may need to make some adjustments to the code.

* There are two main rules for dynamic class names:

1. In template, js, jsx files, dynamic class names must be wrapped with cx or cva.
2. cx, cva (support class-variance-authority) can use tools such as `class-variance-authority`, `classanems`, `clsx`, `tailwind-merge`, etc., for class name concatenation, you can customize one. But the name must be cx or cva.

## Vue

1. template
   1. Static class names in template
  
    ```html
    <div class="flex items-center justify-center h-screen px-6 bg-gray-200"></div>
    ```

   2. Dynamic class names in template
      1. Expressions (*must use cx or cva to wrap)

      ```html
      <div :class="cx(!open && 'hidden', 'flex items-center justify-center h-screen px-6 bg-gray-200')"></div>
      ```

      2. Variables

      ```html
      <template>
        <div :class="boxClass"></div>
      </template>
      <script setup>
      import { cx } from 'class-variance-authority';

      const boxClass = cx(!open && 'hidden', 'flex items-center justify-center h-screen px-6 bg-gray-200')
      </script>
      ```
      3. Custom component attributes in template are treated as class names
      ```html
      <template>
        <Select :dropdown-class="boxClass" />
      </template>
      <script setup>
      import { cx } from 'class-variance-authority';

      const boxClass = cx(!open && 'hidden', 'flex items-center justify-center h-screen px-6 bg-gray-200')
      </script>
      ```

2. Class names in jsx
   1. cx、cva
   
   ```js
   import { cx } from 'class-variance-authority';

   export boxClass = cx(!open && 'hidden', 'flex items-center justify-center h-screen px-6 bg-gray-200');
   ```

   2. HTML in js same as 1

3. Class names in js
   1. Same as 3.1

> Currently does not support in template strings

### React

TODO

## Options

```typescript
type UserOptions = {
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
};
```