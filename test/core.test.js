import test from 'ava'
import { parseUi } from '../'
import path from 'path'

test(`Parses .vue files in a given directory returning an array of VueComponent`, async (t) => {
  const vueComponents = await parseUi(path.join(__dirname, `../../pleasure-ui-vue/src`))
  t.true(Array.isArray(vueComponents))
  vueComponents.forEach(vueComponent => {
    console.log(JSON.stringify(vueComponent, null, 2))
    t.truthy(vueComponent.filePath)
    t.truthy(vueComponent.name)
    t.true(Array.isArray(vueComponent.category))
    t.truthy(vueComponent.docs)
    t.truthy(vueComponent.component)
    console.log(vueComponent.component)
  })
})
