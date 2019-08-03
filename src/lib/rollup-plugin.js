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
 * @param {String} componentsSrc - Where to read the components from
 * @param {String} destination - Where to copy all of the asset files. Defaults to the rollup dist folder.
 * @param {String} jsDist - Location of the js distribution. Defaults to rollup dist script.
 * @param {String} cssFile=style.css - Destination to the css file.
 * @return {RollupPlugin} The rollup plugin
 */
export function RollupPlugin ({ componentsSrc, destination, jsDist, cssFile = 'style.css' }) {
  return {
    name: 'pleasure-vue-doc',
    transform () {
      // console.log(`transform hook`, path.join(__dirname, '../assets/index.html'))
      this.addWatchFile(path.join(__dirname, '../assets/index.html'))
      this.addWatchFile(path.join(__dirname, '../assets/style.css'))
    },
    async generateBundle (opts) {
      // console.log(`generate bundle`, { opts }, !destination, path.dirname(opts.file))
      if (!destination) {
        console.log({ opts })
        destination = path.dirname(opts.file)
      }

      // console.log({ opts })
      const dist = (...paths) => {
        return path.join(destination, ...paths)
      }
      console.log({ componentsSrc })
      const ComponentDocs = await parseUi(componentsSrc)
      const srcDocIndex = resolve('assets/index.html')
      const srcStyle = resolve('assets/style.css')
      const dstStyle = dist('style.css')
      const docIndex = dist('index.html')

      removeIfExists(dstStyle)
      removeIfExists(docIndex)

      // todo: set dynamic
      let newIndex = fs.readFileSync(srcDocIndex).toString()
      newIndex = newIndex.replace(`JS_DIST`, jsDist || path.basename(opts.file))
      newIndex = newIndex.replace(`CSS_DIST`, cssFile)
      newIndex = newIndex.replace(`VUE_COMPONENTS`, JSON.stringify(ComponentDocs, null, 2))
      this.emitAsset('index.html', newIndex)
      this.emitAsset('style.css', fs.readFileSync(srcStyle))
    }
  }
}
