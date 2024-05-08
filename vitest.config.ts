import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**'],
    coverage: {
      provider: 'istanbul', // or 'v8'
      reporter: ['text', 'json', 'html'],
      exclude: ['examples/**/*', 'node_modules/**/*', 'playground/**/*', 'scripts/**/*', 'playwright-test/**/*']
    },
  },
})