import { registerEditorActions } from '@/monaco/actions'
import { langConfig } from '@/monaco/config'
import { registerHoverProvider } from '@/monaco/hovers'
import { getShiki } from '@/monaco/shiki'
import { registerLangSuggestions } from '@/monaco/suggestions'
import { useConfigStore } from '@/stores/config'
import { useMonaco } from '@monaco-editor/react'
import { shikiToMonaco } from '@shikijs/monaco'
import { useEffect } from 'react'

export function useWaMonaco() {
  const { theme } = useConfigStore()
  const monaco = useMonaco()

  const registerLangHighlighter = async (monaco: typeof useMonaco) => {
    const highlighter = await getShiki(theme)
    shikiToMonaco(highlighter, monaco)
  }

  useEffect(() => {
    if (!monaco)
      return

    monaco.languages.register({ id: 'wa' })
    monaco.languages.setLanguageConfiguration('wa', langConfig)

    monaco.languages.register({ id: 'wz' })
    monaco.languages.setLanguageConfiguration('wz', langConfig)

    registerLangHighlighter(monaco as unknown as typeof useMonaco)
    registerLangSuggestions(monaco)
    registerHoverProvider(monaco)
    registerEditorActions(monaco)
  }, [monaco])

  return monaco
}
