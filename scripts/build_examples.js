const fs = require('fs')
const path = require('path')

const examples = {}
const examplesDir = path.resolve(__dirname, '../examples')
const files = fs.readdirSync(examplesDir)

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
})

const examplesJson = JSON.stringify(examples)

fs.writeFileSync(path.resolve(__dirname, '../assets/examples.json'), examplesJson)
