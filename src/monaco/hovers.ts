import type * as Monaco from 'monaco-editor'
import { LANG_BOOL, LANG_BOOL_ZH, LANG_KEYWORDS, LANG_KEYWORDS_ZH, LANG_TYPES, LANG_TYPES_ZH } from '@/constants/lang'

export function registerHoverProvider(monaco: typeof Monaco) {
  const waHoverProvider: Monaco.languages.HoverProvider = {
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
          desc = 'Complex number type'
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

  const wzHoverProvider: Monaco.languages.HoverProvider = {
    provideHover: (model: Monaco.editor.ITextModel, pos: Monaco.IPosition) => {
      const word = model.getWordAtPosition(pos)
      if (!word)
        return null

      if (LANG_KEYWORDS_ZH.includes(word.word)) {
        return {
          contents: [
            { value: `**${word.word}**` },
            { value: 'Wz 语言关键字' },
          ],
        }
      }

      if (LANG_TYPES_ZH.includes(word.word)) {
        let desc = '基本类型'
        if (word.word.includes('整')) {
          desc = '有符号整数类型'
        }
        else if (word.word.includes('正')) {
          desc = '无符号整数类型'
        }
        else if (word.word.includes('精')) {
          desc = '浮点数类型'
        }
        else if (word.word.includes('复')) {
          desc = '复数类型'
        }

        return {
          contents: [
            { value: `**${word.word}**` },
            { value: desc },
          ],
        }
      }

      if (LANG_BOOL_ZH.includes(word.word)) {
        return {
          contents: [
            { value: `**${word.word}**` },
            { value: '布尔值' },
          ],
        }
      }

      return null
    },
  }

  monaco.languages.registerHoverProvider('wa', waHoverProvider)
  monaco.languages.registerHoverProvider('wz', wzHoverProvider)
}
