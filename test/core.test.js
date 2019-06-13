import test from 'ava'
import { parseVueDocs } from '../'
import path from 'path'

test(`Parses .vue files in a given directory returning an array of VueComponent`, async (t) => {
  const vueComponents = await parseVueDocs(path.join(__dirname, `../../pleasure-ui-vue/src`))
  t.true(Array.isArray(vueComponents))
  vueComponents.forEach(vueComponent => {
    t.truthy(vueComponent.filePath)
    t.truthy(vueComponent.name)
    t.true(Array.isArray(vueComponent.category))
    t.truthy(vueComponent.docs)
  })
})
