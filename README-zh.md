# unplugin-tailwindcss-shortener

[![NPM version](https://img.shields.io/npm/v/unplugin-tailwindcss-shortener?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-tailwindcss-shortener)


缩短 Tailwind CSS 的类名

- 支持 Vue and React (TODO)
- 支持 Vite、Vue Cli and Webpack

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
import Starter from 'unplugin-tailwindcss-shortener/vite'

export default defineConfig({
  plugins: [
    Starter({ /* options */ }),
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


## 使用

如果项目中不仅使用了静态类名，还用到了动态类名。那么使用动态类名的代码，你可能需要做一些代码调整。

* 针对动态类名，有两个主要规则

1. 在 template、js、jsx 里，动态类名*必须*需要使用 cx、cva 包裹
2. cx、cva (support class-variance-authority) 可以使用 `class-variance-authority`、`classanems`、`clsx`、`tailwind-merge`等等用来 类名拼接的工具，你可以自定义一个。但是名字必须是 `cx` 或者 `cva`


### Vue

1. template
   1. template 静态类名
  
    ```html
    <div class="flex items-center justify-center h-screen px-6 bg-gray-200"></div>
    ```

   2. template 动态类名
      1. 表达式 (*必须使用 cx、cva 包裹)

      ```html
      <div :class="cx(!open && 'hidden', 'flex items-center justify-center h-screen px-6 bg-gray-200')"></div>
      ```

      2. 变量

      ```html
      <template>
        <div :class="boxClass"></div>
      </template>
      <script setup>
      import { cx } from 'class-variance-authority';

      const boxClass = cx(!open && 'hidden', 'flex items-center justify-center h-screen px-6 bg-gray-200')
      </script>
      ```
      3. template 里自定义组件的属性作为类名处理
      ```html
      <template>
        <Select :dropdown-class="boxClass" />
      </template>
      <script setup>
      import { cx } from 'class-variance-authority';

      const boxClass = cx(!open && 'hidden', 'flex items-center justify-center h-screen px-6 bg-gray-200')
      </script>
      ```

2. jsx 里的类名
   1. cx、cva
   
   ```js
   import { cx } from 'class-variance-authority';

   export boxClass = cx(!open && 'hidden', 'flex items-center justify-center h-screen px-6 bg-gray-200');
   ```

   2. html in js 同 1

3. js 里的类名
   1. 同 3.1

> 目前不支持在模板字符串, 

### React

TODO

## 配置项

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
   * tailwind 的配置文件路径
   * @default './tailwind.config.js'
   */
  tailwindConfig?: string;
  /**
   * Tailwind 的指令文件路径
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
   * 用来调试的信息
   * - /.tailwindcss-shortener
   *  - tailwind.css (Tailwind CSS 生成的 CSS 文件)
   *  - cssMap.json (原类名与短类名映射关系)
   */
  output?: boolean;
};
```