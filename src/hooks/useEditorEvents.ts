import type * as MonacoType from 'monaco-editor'
import { runWa } from '@/lib/wawasm'
import { useEffect, useState } from 'react'

interface EditorEventsProps {
  editorRef: React.RefObject<MonacoType.editor.IStandaloneCodeEditor | null>
  monacoInst: any
}

export function useEditorEvents({
  editorRef,
  monacoInst,
}: EditorEventsProps) {
  const [isSaved, setIsSaved] = useState(true)

  const handleError = () => {
    if (!editorRef.current || !monacoInst)
      return

    const model = editorRef.current.getModel()
    if (!model)
      return

    const err = window.__WA_ERROR__ as string
    if (!err || err === '') {
      monacoInst.editor.setModelMarkers(model, 'wa', [])
      return
    }

    const match = err.match(/(.+):(\d+):(\d+):\s*(.+)/)
    if (match) {
      const [, _file, line, column, message] = match
      const lineNum = Number.parseInt(line)
      const columnNum = Number.parseInt(column)

      const markers: MonacoType.editor.IMarkerData[] = [{
        severity: monacoInst.MarkerSeverity.Error,
        message,
        startLineNumber: lineNum,
        startColumn: columnNum,
        endLineNumber: lineNum,
        endColumn: columnNum + 1,
      }]

      monacoInst.editor.setModelMarkers(model, 'wa', markers)
    }
  }

  const handleFormatCode = () => {
    if (window.__WA_FMT_CODE__ && editorRef.current) {
      const selection = editorRef.current.getSelection()

      editorRef.current.setValue(window.__WA_FMT_CODE__)

      if (selection) {
        editorRef.current.setSelection(selection)
        editorRef.current.revealPositionInCenter(selection.getPosition())
      }
    }
  }

  const handleRunWaCode = (value?: string) => {
    window.__WA_CODE__ = value || ''
    runWa()
    handleFormatCode()
    handleError()
  }

  const handleToggleComment = (editor: MonacoType.editor.IStandaloneCodeEditor, selection: MonacoType.Selection) => {
    if (!editor || !monacoInst)
      return

    const model = editor.getModel()
    if (!model)
      return

    const oldSelection = editor.getSelection()

    const startLineNum = selection.startLineNumber
    const endLineNum = selection.endLineNumber

    const edits: MonacoType.editor.IIdentifiedSingleEditOperation[] = []

    const firstLine = model.getLineContent(startLineNum)
    const isCommented = firstLine.trimStart().startsWith('//')

    for (let i = startLineNum; i <= endLineNum; i++) {
      const line = model.getLineContent(i)

      if (isCommented) {
        const trimmedLine = line.trimStart()
        const leadingSpaces = line.length - trimmedLine.length
        if (trimmedLine.startsWith('//')) {
          const commentContent = trimmedLine.substring(2)
          const newContent = commentContent.startsWith(' ') ? commentContent.substring(1) : commentContent
          const newLine = line.substring(0, leadingSpaces) + newContent
          edits.push({
            range: new monacoInst.Range(i, 1, i, line.length + 1),
            text: newLine,
          })
        }
      }
      else {
        edits.push({
          range: new monacoInst.Range(i, 1, i, 1),
          text: '// ',
        })
      }
    }

    editor.executeEdits('toggle-comment', edits)

    if (oldSelection) {
      let selectionStartCol = oldSelection.startColumn
      let selectionEndCol = oldSelection.endColumn

      if (!isCommented) {
        if (oldSelection.startLineNumber === oldSelection.endLineNumber) {
          selectionStartCol = Math.max(1, selectionStartCol + 3)
          selectionEndCol = Math.max(1, selectionEndCol + 3)
        }
        else {
          if (oldSelection.startColumn > 1)
            selectionStartCol = Math.max(1, selectionStartCol + 3)
          if (oldSelection.endColumn > 1)
            selectionEndCol = Math.max(1, selectionEndCol + 3)
        }
      }
      else {
        const commentPrefixLen = 3
        if (selectionStartCol > commentPrefixLen)
          selectionStartCol = Math.max(1, selectionStartCol - commentPrefixLen)
        if (selectionEndCol > commentPrefixLen)
          selectionEndCol = Math.max(1, selectionEndCol - commentPrefixLen)
      }

      const newSelection = new monacoInst.Selection(
        oldSelection.startLineNumber,
        selectionStartCol,
        oldSelection.endLineNumber,
        selectionEndCol,
      )

      editor.setSelection(newSelection)
      editor.revealPositionInCenter(newSelection.getPosition())
    }
  }

  const handleSaveEvent = (event: CustomEvent) => {
    const { value } = event.detail
    handleRunWaCode(value)
    setIsSaved(true)
  }

  const handleToggleCommentEvent = (event: CustomEvent) => {
    const { editor, selection } = event.detail
    handleToggleComment(editor, selection)
  }

  useEffect(() => {
    window.addEventListener('wa-editor-save', handleSaveEvent as EventListener)
    window.addEventListener('wa-editor-toggle-comment', handleToggleCommentEvent as EventListener)
    return () => {
      window.removeEventListener('wa-editor-save', handleSaveEvent as EventListener)
      window.removeEventListener('wa-editor-toggle-comment', handleToggleCommentEvent as EventListener)
    }
  }, [monacoInst])

  return {
    handleError,
    handleRunWaCode,
    handleFormatCode,
    handleToggleComment,
    isSaved,
    setIsSaved,
  }
}
