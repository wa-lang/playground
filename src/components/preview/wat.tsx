import type { useWaMonaco } from '@/hooks/useWaMonaco'
import type { FC } from 'react'
import { monacoConfig } from '@/monaco/config'
import { Editor } from '@monaco-editor/react'

export const WatPreview: FC<{
  wat: string | null
  monaco: ReturnType<typeof useWaMonaco>
  theme: 'dark' | 'light'
}> = ({ wat, monaco, theme }) => {
  const monacoTheme = theme === 'dark' ? 'vitesse-dark' : 'vitesse-light'

  return (
    <Editor
      language="wasm"
      {...monaco}
      options={{
        ...monacoConfig,
        readOnly: true,
        fontSize: 12,
      }}
      height="100%"
      theme={monacoTheme}
      value={wat || 'No WAT'}
    />
  )
}
