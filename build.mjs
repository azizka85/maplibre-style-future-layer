import {rmSync} from 'fs'

import * as esbuild from 'esbuild'

const mode = process.env.NODE_ENV || 'production'
const dev = mode === 'development'

rmSync(`./public/dist`, {
  recursive: true,
  force: true
})

const clientResult = await esbuild.build({
  entryPoints: {
    './main': './src/client/main.ts'
  },
  outdir: `./public/dist`,
  format: 'esm',
  target: 'esnext',
  bundle: true,
  splitting: true,
  sourcemap: dev,
  minify: !dev
})

console.log('client - ', clientResult)

rmSync('./dist', {
  recursive: true,
  force: true
})

const serverResult = await esbuild.build({
  entryPoints: [
    './src/server/main.ts'
  ],
  outdir: './dist',
  format: 'cjs',
  platform: 'node',
  bundle: true,
  minify: !dev
})

console.log('server - ', serverResult)
