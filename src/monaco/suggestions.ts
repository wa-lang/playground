import type * as Monaco from 'monaco-editor'
import { LANG_BOOL, LANG_KEYWORDS, LANG_SNIPPETS, LANG_TYPES } from '@/constants/lang'

export function registerLangSuggestions(monaco: typeof Monaco) {
  monaco.languages.registerCompletionItemProvider('wa', {
    triggerCharacters: ['.'],
    provideCompletionItems: (model, post, _context, _token) => {
      const wordInfo = model.getWordUntilPosition(post)
      const wordRange = new monaco.Range(
        post.lineNumber,
        wordInfo.startColumn,
        post.lineNumber,
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
  })
}
