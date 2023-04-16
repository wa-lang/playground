const fs = require('fs')
const path = require('path')

const examples = {}
const examplesDir = path.resolve(__dirname, '../examples')
const files = fs.readdirSync(examplesDir)
const defaultOrder = ['hello', 'hello-zh', 'count', 'heart', 'brainfuck', 'iface']

files.forEach((file) => {
  const filePath = path.join(examplesDir, file)
  let stat
  try {
    stat = fs.statSync(filePath)
  } catch (err) {
    console.error(err)
  }
  if (stat.isFile() && path.extname(filePath) === '.wa') {
    const name = path.basename(filePath, '.wa')
    examples[name] = fs.readFileSync(filePath, 'utf-8')
  }
  if (stat.isFile() && path.extname(filePath) === '.wz') {
    const name = path.basename(filePath, '.wz')
    examples[name] = fs.readFileSync(filePath, 'utf-8')
  }
})

const orderedExamples = defaultOrder
  .reduce((acc, key) => {
    if (examples[key]) { acc[key] = examples[key] }
    return acc
  }, {})
const otherExamples = Object.keys(examples)
  .filter((key) => !defaultOrder.includes(key))
  .reduce((acc, key) => { acc[key] = examples[key]; return acc }, {})
const allExamples = Object.assign({}, orderedExamples, otherExamples)

const examplesJson = JSON.stringify(allExamples)

const initJsPath = path.resolve(__dirname, '../js/init.js')
const initJs = fs.readFileSync(initJsPath, 'utf-8')
const newInitJs = initJs.replace(/const __WA_EXAMPLES__ = .*/, `const __WA_EXAMPLES__ = ${examplesJson}`)
fs.writeFileSync(initJsPath, newInitJs)
