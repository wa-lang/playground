import type * as MonacoType from 'monaco-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebounce } from '@/hooks/useDebounce'
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

  const handleError = () => {
    if (!editorRef.current || !monacoInst)
      return

    const model = editorRef.current.getModel()
    if (!model)
      return

    const errorStr = window.__WA_ERROR__ as string

    if (!errorStr || errorStr === '') {
      monacoInst.editor.setModelMarkers(model, 'wa', [])
      return
    }

    const match = errorStr.match(/(.+):(\d+):(\d+):\s*(.+)/)

    if (match) {
      const [, _file, line, column, message] = match
      const lineNumber = Number.parseInt(line)
      const columnNumber = Number.parseInt(column)

      const markers: MonacoType.editor.IMarkerData[] = [{
        severity: monacoInst.MarkerSeverity.Error,
        message,
        startLineNumber: lineNumber,
        startColumn: columnNumber,
        endLineNumber: lineNumber,
        endColumn: columnNumber + 1,
      }]

      monacoInst.editor.setModelMarkers(model, 'wa', markers)
    }
  }

  const handleRunWaCode = useDebounce((value?: string) => {
    window.__WA_CODE__ = value || ''
    runWa()
    handleError()
  }, 200)

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
          onChange={handleRunWaCode}
        />
      </div>
    </div>
  )
}
