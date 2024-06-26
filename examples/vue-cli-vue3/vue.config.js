const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      require("../../dist/webpack.cjs").default({
        output: true,
        tailwindCSS: './src/global.css'
      }),
    ],
  },
})
