import type * as Monaco from 'monaco-editor'
import { LANG_BOOL, LANG_KEYWORDS, LANG_SNIPPETS, LANG_TYPES } from '@/constants/lang'

export function registerLangSuggestions(monaco: typeof Monaco) {
  const completionProvider: Monaco.languages.CompletionItemProvider = {
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

  monaco.languages.registerCompletionItemProvider('wa', completionProvider)
  monaco.languages.registerCompletionItemProvider('wz', completionProvider)
}
