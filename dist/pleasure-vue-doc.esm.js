/*!
 * pleasure-vue-doc v1.0.0
 * (c) 2019-2019 Martin Rafael <tin@devtin.io>
 * MIT
 */
import { deepScanDir } from 'pleasure-utils';
import path from 'path';
import { pathExists, readJson } from 'fs-extra';
import Promise from 'bluebird';
import vuedoc from '@vuedoc/md';
import fs from 'fs';

/**
 * @typedef {Object} CategoryMeta
 * @desc Metadata of a category
 * @property {String|null} icon - Icon of the component. See [Font Awesome](https://fontawesome.com/icons?d=gallery&m=free).
 * @property {String} name - Full name of the category. Defaults to the result of analyzing the anatomy of the directory
 * structure. i.e. `/components/:category/component.vue`
 *
 * @example From `/:category/meta.json`
 * ```json
 * {
 *   "name": "The category name",
 *   "icon": "apple"
 * }
 * ```
 */

/**
 * @typedef {Object} VueComponent
 * @property {String} filePath - Absolute path to the component
 * @property {String} name - The tag name of the component (i.e. `<component-name/>`)
 * @property {CategoryMeta[]} category - Category of the component
 * @property {String} docs - Markdown docs of the component
 */

/**
 * @typedef {VueComponent[]} VueComponents
 * @desc An array of {@link VueComponent}'s
 */

/**
 * Deeply scans given directory looking for `.vue` files.
 * @param {String} directory - Directory to components
 * @return {Promise<VueComponents>}
 */
async function parseUi (directory) {
  return Promise.map(await deepScanDir(directory, { only: [/\.vue$/] }), async (filePath) => {
    let name = path.basename(filePath).replace(/\.vue$/, '');
    let icon = null;
    const metaFile = path.join(path.dirname(filePath), 'meta.json');

    if (await pathExists(metaFile)) {
      ({ name = name, icon } = await readJson(metaFile));
    }

    const category = path.relative(directory, filePath).split('/').filter(file => {
      return !/\.vue/.test(file)
    });

    const docs = await vuedoc.md({ filename: filePath });

    return {
      filePath,
      name,
      category,
      docs
    }
  })
}

const resolve = (...paths) => {
  return path.join(__dirname, '../', ...paths)
};

const removeIfExists = file => {
  if (fs.existsSync(file)) {
    return fs.unlinkSync(file)
  }
};

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
function RollupPlugin ({ componentsSrc, destination, jsDist, cssFile = 'style.css' }) {
  return {
    name: 'pleasure-vue-doc',
    transform () {
      // console.log(`transform hook`, path.join(__dirname, '../assets/index.html'))
      this.addWatchFile(path.join(__dirname, '../assets/index.html'));
      this.addWatchFile(path.join(__dirname, '../assets/style.css'));
    },
    async generateBundle (opts) {
      // console.log(`generate bundle`, { opts }, !destination, path.dirname(opts.file))
      if (!destination) {
        console.log({ opts });
        destination = path.dirname(opts.file);
      }

      // console.log({ opts })
      const dist = (...paths) => {
        return path.join(destination, ...paths)
      };
      console.log({ componentsSrc });
      const ComponentDocs = await parseUi(componentsSrc);
      const srcDocIndex = resolve('assets/index.html');
      const srcStyle = resolve('assets/style.css');
      const dstStyle = dist('style.css');
      const docIndex = dist('index.html');

      removeIfExists(dstStyle);
      removeIfExists(docIndex);

      // todo: set dynamic
      let newIndex = fs.readFileSync(srcDocIndex).toString();
      newIndex = newIndex.replace(`JS_DIST`, jsDist || path.basename(opts.file));
      newIndex = newIndex.replace(`CSS_DIST`, cssFile);
      newIndex = newIndex.replace(`VUE_COMPONENTS`, JSON.stringify(ComponentDocs, null, 2));
      this.emitAsset('index.html', newIndex);
      this.emitAsset('style.css', fs.readFileSync(srcStyle));
    }
  }
}

var index = {
  parseUi,
  RollupPlugin
};

export default index;
