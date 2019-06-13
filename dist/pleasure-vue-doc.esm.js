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
 * Deeply scans given directory looking for `.vue` files.
 * @param {String} directory - Directory to components
 * @return {Promise<VueComponent[]>} Array of {@link VueComponent}'s
 */
async function parseVueDocs (directory) {
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

var index = {
  parseVueDocs
};

export default index;
