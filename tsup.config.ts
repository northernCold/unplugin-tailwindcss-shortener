import type { Options } from 'tsup'

export default <Options>{
  banner: ({ format }) => {
    if (format === 'esm') {
      return {
        js: `import {createRequire as __createRequire} from 'module';var require=__createRequire(import\.meta.url);`,
      };
    }
  },
  entryPoints: [
    'src/*.ts',
  ],
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  onSuccess: 'npm run build:fix',
}
