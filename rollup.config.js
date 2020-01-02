import path from 'path'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import alias from 'rollup-plugin-alias'
import { name, version, author, license } from './package.json'
import NodeResolve from 'rollup-plugin-node-resolve'

const fromSrc = (...paths) => {
  return path.join(__dirname, 'src', ...paths)
}

const plugins = [
  /*NodeResolve({only: ['lodash', '@pleasure-js/api-client', 'vue',' vuex']}),*/
  alias({
    src: fromSrc(),
    lib: fromSrc('lib')
  }),
  json(),
  commonjs({
    // non-CommonJS modules will be ignored, but you can also
    // specifically include/exclude files

    // if true then uses of `global` won't be dealt with by this plugin
    ignoreGlobal: true, // Default: false

    // if false then skip sourceMap generation for CommonJS modules
    sourceMap: true // Default: true
  })
]

const banner = `/*!
 * ${ name } v${ version }
 * (c) 2019-${ new Date().getFullYear() } ${ author }
 * ${ license }
 */`

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: `dist/${name}.js`,
        format: 'cjs',
        banner
      },
    ],
    plugins
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: `dist/${name}.esm.js`,
        format: 'esm',
        banner
      }
    ],
    plugins
  },
]
