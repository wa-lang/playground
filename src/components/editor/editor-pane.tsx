import type * as MonacoType from 'monaco-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEditorEvents } from '@/hooks/useEditorEvents'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useWaMonaco } from '@/hooks/useWaMonaco'
import { runWa } from '@/lib/wawasm'
import { monacoConfig } from '@/monaco/config'
import { useConfigStore } from '@/stores/config'
import { Editor } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import examples from '../../../public/examples.json'
import { SkeletonCode } from '../skeleton-code'

interface ICode {
  name: string
  code: string
}

export function EditorPane() {
  const isMobile = useIsMobile()
  const [current, setCurrent] = useState<ICode | null>(examples[0])
  const monacoInst = useWaMonaco()
  const { theme } = useConfigStore()
  const monacoTheme = theme === 'dark' ? 'vitesse-dark' : 'vitesse-light'
  const editorRef = useRef<MonacoType.editor.IStandaloneCodeEditor | null>(null)

  const { isSaved, setIsSaved, handleError, handleFormatCode } = useEditorEvents({ editorRef, monacoInst })

  const handleRunCode = () => {
    runWa()
    handleError()
    handleFormatCode()
    setIsSaved(true)
  }

  useEffect(() => {
    window.__WA_CODE__ = current?.code || ''
    handleRunCode()
  }, [current])

  const handleEditorDidMount = (editor: MonacoType.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
  }

  const handleEditorChange = (value?: string) => {
    setIsSaved(false)
    window.__WA_CODE__ = value || ''
  }

  const handleSave = () => {
    if (editorRef.current) {
      window.__WA_CODE__ = editorRef.current.getValue()
      handleRunCode()
    }
  }

  return (
    <div className="h-full">
      <div className="px-4 py-1 border-b border-dashed flex gap-2 items-center">
        <Select
          value={current?.name}
          onValueChange={(value) => {
            const selected = examples.find(ex => ex.name === value)
            if (selected)
              setCurrent(selected)
          }}
        >
          <SelectTrigger className="w-[180px] py-1 h-7">
            <SelectValue placeholder="Select example" />
          </SelectTrigger>
          <SelectContent>
            {examples.map(example => (
              <SelectItem
                className="h-7"
                key={example.name}
                value={example.name}
              >
                {example.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center">
          <div className="flex items-center">
            {!isMobile && (
              <span className="text-xs mr-3 text-primary/40">
                {navigator.platform.includes('Mac') ? '⌘+S' : 'Ctrl+S'}
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-theme text-primary-foreground"
            >
              保存
            </button>
          </div>
        </div>
      </div>
      <div className="h-full w-full">
        <div className="h-full w-full relative">
          <div className={`size-3 absolute top-2 right-4 rounded-full z-10 ${isSaved ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <Editor
            loading={<SkeletonCode />}
            language="wa"
            {...monacoInst}
            height="100%"
            theme={monacoTheme}
            options={monacoConfig}
            value={current?.code}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
          />
        </div>
      </div>
    </div>
  )
}
