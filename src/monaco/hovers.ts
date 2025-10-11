import type * as Monaco from 'monaco-editor'
import { LANG_BOOL, LANG_KEYWORDS, LANG_TYPES } from '@/constants/lang'

export function registerHoverProvider(monaco: typeof Monaco) {
  const hoverProvider: Monaco.languages.HoverProvider = {
    provideHover: (model: Monaco.editor.ITextModel, pos: Monaco.IPosition) => {
      const word = model.getWordAtPosition(pos)
      if (!word)
        return null

      if (LANG_KEYWORDS.includes(word.word)) {
        return {
          contents: [
            { value: `**${word.word}**` },
            { value: 'Wa Lang Keyword' },
          ],
        }
      }

      if (LANG_TYPES.includes(word.word)) {
        let desc = 'Basic Type'
        if (word.word.startsWith('int') || word.word.startsWith('i')) {
          desc = 'Signed integer type'
        }
        else if (word.word.startsWith('uint') || word.word.startsWith('u')) {
          desc = 'Unsigned integer type'
        }
        else if (word.word.startsWith('float') || word.word.startsWith('f')) {
          desc = 'Floating-point number type'
        }
        else if (word.word.startsWith('complex') || word.word.startsWith('c')) {
          desc = 'Plural Types'
        }

        return {
          contents: [
            { value: `**${word.word}**` },
            { value: desc },
          ],
        }
      }

      if (LANG_BOOL.includes(word.word)) {
        return {
          contents: [
            { value: `**${word.word}**` },
            { value: 'Boolean' },
          ],
        }
      }

      return null
    },
  }

  monaco.languages.registerHoverProvider('wa', hoverProvider)
  monaco.languages.registerHoverProvider('wz', hoverProvider)
}
