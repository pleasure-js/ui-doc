import path from 'path'
import fs from 'fs'
import { parseUi } from './parse-ui.js'

const resolve = (...paths) => {
  return path.join(__dirname, '../', ...paths)
}

const removeIfExists = file => {
  if (fs.existsSync(file)) {
    return fs.unlinkSync(file)
  }
}

/**
 * @typedef {Object} RollupPlugin
 * @see {@link https://rollupjs.org/guide/en#plugins-overview}
 */

/**
 * @typedef {Object} ComponentMap
 * @param {String} srcName - Original component name
 * @param {String} dstName - Name to use
 */

/**
 * @param {String} componentsSrc - Where to read the components from
 * @param {String} destination - Where to copy all of the asset files (relative to CWD). Defaults to the rollup dist folder.
 * @param {String} jsDist - Location of the js distribution. Defaults to rollup dist script.
 * @param {Array} includeCss - Additional css files to link in the html output.
 * @param {Array} includeJs - Additional js files to link in the html output.
 * @param {ComponentMap[]} [componentsMap] - Additional js files to link in the html output.
 * @param {String} cssFile=style.css - Destination to the css file.
 * @return {RollupPlugin} The rollup plugin
 */
export function RollupPlugin ({ componentsSrc, destination, jsDist, includeCss = [], includeJs = [], cssFile = 'style.css' }) {
  return {
    name: 'pleasure-ui-doc',
    transform () {
      // console.log(`transform hook`, path.join(__dirname, '../assets/index.html'))
      this.addWatchFile(path.join(__dirname, '../assets/index.html'))
      this.addWatchFile(path.join(__dirname, '../assets/style.css'))
    },
    async generateBundle (opts) {
      // console.log(`generate bundle`, { opts }, !destination, path.dirname(opts.file))
      if (!destination) {
        // console.log({ opts })
        destination = path.dirname(opts.file)
      } else {
        // console.log(`process.cwd`, process.cwd())
        // console.log(`destination`, destination)
        destination = path.join(process.cwd(), destination)
      }

      // console.log({ opts })
      const dist = (...paths) => {
        return path.join(destination, ...paths)
      }
      // console.log({ componentsSrc })
      const ComponentDocs = await parseUi(componentsSrc)
      const srcDocIndex = resolve('assets/index.html')
      const srcStyle = resolve('assets/style.css')
      const dstStyle = dist('style.css')
      const docIndex = dist('index.html')

      removeIfExists(dstStyle)
      removeIfExists(docIndex)

      // todo: set dynamic
      let newIndex = fs.readFileSync(srcDocIndex).toString()

      // HTML customization
      newIndex = newIndex.replace(`JS_DIST`, jsDist || (opts.file ? path.basename(opts.file) : ''))
      newIndex = newIndex.replace(`CSS_DIST`, cssFile)
      newIndex = newIndex.replace(`VUE_COMPONENTS`, JSON.stringify(ComponentDocs, null, 2))
      newIndex = newIndex.replace(`IIFE_NAME`, opts.name)
      newIndex = newIndex.replace(`<!-- ADDITIONAL -->`, includeCss.map(cssFile => {
        return `<link href="${ cssFile }" rel="stylesheet">`
      }).concat(includeJs.map(jsFile => {
          let finalJsFile = /^http/.test(jsFile) ? jsFile : (/^\//.test(jsFile) ? path.basename(jsFile) : jsFile.split('/')[0] + '.js')
          let pckgJson
          try {
            pckgJson = require.resolve(`${ jsFile }/package.json`)
          } catch (err) {
            console.log(`error finding packgjson`)
          }

          console.log({ jsFile, finalJsFile, pckgJson })

          // copy from deps
          if (!/^http/.test(jsFile)) {
            let distPath = ''

            if (fs.existsSync(pckgJson)) {
              const { main, browser, bundlesize } = require(pckgJson)

              // targeting axios
              if (bundlesize) {
                distPath = bundlesize[0].path
              } else {
                distPath = browser && typeof browser === 'string' ? browser : main
              }

              console.log({ main, browser })
            }

            // regular module
            if (/^[a-z]/i.test(jsFile)) {
              fs.copyFileSync(require.resolve(path.join(jsFile, distPath)), dist(finalJsFile))
            }
            // absolute path
            else if (/^\//.test(jsFile)) {
              fs.copyFileSync(jsFile, dist(finalJsFile))
            }
          }
          return `<script src='${ finalJsFile }'></script>`
        }
      )).join(`\n  `))

      // Emitting assets
      fs.writeFileSync(docIndex, newIndex)
      fs.writeFileSync(dstStyle, fs.readFileSync(srcStyle))
      /*
            this.emitFile({ type: 'asset', source: newIndex, fileName: 'index.html' })
            this.emitFile({ type: 'asset', source: fs.readFileSync(srcStyle), fileName: 'style.css' })
      */
    }
  }
}
