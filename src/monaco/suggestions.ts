import type * as Monaco from 'monaco-editor'
import { LANG_BOOL, LANG_BOOL_ZH, LANG_KEYWORDS, LANG_KEYWORDS_ZH, LANG_SNIPPETS, LANG_SNIPPETS_ZH, LANG_TYPES, LANG_TYPES_ZH } from '@/constants/lang'

export function registerLangSuggestions(monaco: typeof Monaco) {
  const waCompletionProvider: Monaco.languages.CompletionItemProvider = {
    triggerCharacters: ['.'],
    provideCompletionItems: (
      model: Monaco.editor.ITextModel,
      position: Monaco.Position,
      _context: Monaco.languages.CompletionContext,
      _token: Monaco.CancellationToken,
    ) => {
      const wordInfo = model.getWordUntilPosition(position)
      const wordRange = new monaco.Range(
        position.lineNumber,
        wordInfo.startColumn,
        position.lineNumber,
        wordInfo.endColumn,
      )

      const suggestions: Monaco.languages.CompletionItem[] = []

      LANG_KEYWORDS.forEach((k) => {
        suggestions.push({
          label: k,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: k,
          range: wordRange,
          detail: 'Keyword',
        })
      })

      LANG_TYPES.forEach((t) => {
        suggestions.push({
          label: t,
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: t,
          range: wordRange,
          detail: 'Type',
        })
      })

      LANG_BOOL.forEach((b) => {
        suggestions.push({
          label: b,
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: b,
          range: wordRange,
          detail: 'Boolean',
        })
      })

      LANG_SNIPPETS.forEach((snippet) => {
        suggestions.push({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snippet.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: wordRange,
          detail: snippet.detail,
        })
      })

      return { suggestions }
    },
  }

  const wzCompletionProvider: Monaco.languages.CompletionItemProvider = {
    triggerCharacters: ['.'],
    provideCompletionItems: (
      model: Monaco.editor.ITextModel,
      position: Monaco.Position,
      _context: Monaco.languages.CompletionContext,
      _token: Monaco.CancellationToken,
    ) => {
      const wordInfo = model.getWordUntilPosition(position)
      const wordRange = new monaco.Range(
        position.lineNumber,
        wordInfo.startColumn,
        position.lineNumber,
        wordInfo.endColumn,
      )

      const suggestions: Monaco.languages.CompletionItem[] = []

      LANG_KEYWORDS_ZH.forEach((k) => {
        suggestions.push({
          label: k,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: k,
          range: wordRange,
          detail: '关键字',
        })
      })

      LANG_TYPES_ZH.forEach((t) => {
        suggestions.push({
          label: t,
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: t,
          range: wordRange,
          detail: '类型',
        })
      })

      LANG_BOOL_ZH.forEach((b) => {
        suggestions.push({
          label: b,
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: b,
          range: wordRange,
          detail: '布尔值',
        })
      })

      LANG_SNIPPETS_ZH.forEach((snippet) => {
        suggestions.push({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snippet.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: wordRange,
          detail: snippet.detail,
        })
      })

      return { suggestions }
    },
  }

  monaco.languages.registerCompletionItemProvider('wa', waCompletionProvider)
  monaco.languages.registerCompletionItemProvider('wz', wzCompletionProvider)
}
