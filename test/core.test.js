import test from 'ava'
import { parseVueDocs } from '../'
import path from 'path'

test(`Parses .vue files in a given directory returning an array of VueComponent`, async (t) => {
  const parsedDocs = await parseVueDocs(path.join(__dirname, `../../pleasure-ui-vue/src`))
  console.log({ parsedDocs })
  t.true(Array.isArray(parsedDocs))
})


