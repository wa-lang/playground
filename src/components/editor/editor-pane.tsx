import type * as MonacoType from 'monaco-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEditorEvents } from '@/hooks/useEditorEvents'
import { useWaMonaco } from '@/hooks/useWaMonaco'
import { runWa } from '@/lib/wawasm'
import { monacoConfig } from '@/monaco/config'
import { useConfigStore } from '@/stores/config'
import Editor from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import examples from '../../../public/examples.json'
import { SkeletonCode } from '../skeleton-code'

interface ICode {
  name: string
  code: string
}

export function EditorPane() {
  const [current, setCurrent] = useState<ICode | null>(examples[0])
  const monacoInst = useWaMonaco()
  const { theme } = useConfigStore()
  const monacoTheme = theme === 'dark' ? 'vitesse-dark' : 'vitesse-light'
  const editorRef = useRef<MonacoType.editor.IStandaloneCodeEditor | null>(null)

  const { handleError } = useEditorEvents({ editorRef, monacoInst })

  useEffect(() => {
    window.__WA_CODE__ = current?.code || ''
    runWa()
    handleError()
  }, [current])

  const handleEditorDidMount = (editor: MonacoType.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
  }

  return (
    <div className="h-full">
      <div className="px-4 py-2 border-b border-dashed flex gap-2 items-center">
        <Select
          value={current?.name}
          onValueChange={(value) => {
            const selected = examples.find(ex => ex.name === value)
            if (selected)
              setCurrent(selected)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select example" />
          </SelectTrigger>
          <SelectContent>
            {examples.map(example => (
              <SelectItem key={example.name} value={example.name}>
                {example.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="h-full w-full">
        <Editor
          loading={<SkeletonCode />}
          language="wa"
          {...monacoInst}
          height="100%"
          theme={monacoTheme}
          options={monacoConfig}
          value={current?.code}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  )
}
