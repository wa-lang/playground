import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

interface IExample {
  name: string
  code: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const VALID_EXTENSIONS = ['.wa', '.wz']
const DEFAULT_ORDER = ['hello', 'count', 'heart', 'brainfuck', 'closure', 'iface', 'map', 'defer', 'complex', 'iter', 'hello-wz']
const EXAMPLES_DIR = path.resolve(__dirname, '../examples')
const OUTPUT_PATH = path.resolve(__dirname, '../public/examples.json')

function loadExamples(): IExample[] {
  const examples: IExample[] = []

  try {
    const files = fs.readdirSync(EXAMPLES_DIR)

    for (const file of files) {
      const filePath = path.join(EXAMPLES_DIR, file)
      const extension = path.extname(filePath)

      if (VALID_EXTENSIONS.includes(extension)) {
        try {
          const name = path.basename(file, extension)
          const code = fs.readFileSync(filePath, 'utf-8')
          examples.push({ name, code })
        }
        catch (err) {
          console.error(`Error reading file ${file}:`, err)
        }
      }
    }
  }
  catch (err) {
    console.error('Error reading examples directory:', err)
  }

  return examples
}

function sortExamples(examples: IExample[]): IExample[] {
  const orderedExamples = DEFAULT_ORDER
    .map(name => examples.find(example => example.name === name))
    .filter((example): example is IExample => example !== undefined)

  const remainingExamples = examples.filter(example => !DEFAULT_ORDER.includes(example.name))
  return [...orderedExamples, ...remainingExamples]
}

function main(): void {
  const examples = loadExamples()
  const sortedExamples = sortExamples(examples)

  const finalExamples = sortedExamples.map(({ name, code }) => ({
    name,
    code,
  }))

  try {
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalExamples, null, 2))
    console.log('Successfully generated examples.json')
  }
  catch (err) {
    console.error('Error writing examples.json:', err)
  }
}

main()
