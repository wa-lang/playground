import { langConfig } from '@/monaco/config'
import { getShiki } from '@/monaco/shiki'
import { useConfigStore } from '@/stores/config'
import { useMonaco } from '@monaco-editor/react'
import { shikiToMonaco } from '@shikijs/monaco'
import { useEffect } from 'react'

export function useWasmMonaco() {
  const { theme } = useConfigStore()
  const monaco = useMonaco()

  const registerLangHighlighter = async (monaco: typeof useMonaco) => {
    const highlighter = await getShiki(theme)
    shikiToMonaco(highlighter, monaco)
  }

  useEffect(() => {
    if (!monaco)
      return

    monaco.languages.register({ id: 'wasm' })
    monaco.languages.setLanguageConfiguration('wasm', langConfig)

    registerLangHighlighter(monaco as unknown as typeof useMonaco)
  }, [monaco])

  return monaco
}
