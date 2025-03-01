import type * as Monaco from 'monaco-editor'

function registerSaveAction(monaco: typeof Monaco) {
  monaco.editor.registerCommand('wa.editor.save', () => {
    const editorInst = monaco.editor.getEditors()
    if (!editorInst || editorInst.length === 0)
      return

    const editor = editorInst.find(e => e.hasTextFocus())
    if (!editor)
      return

    const value = editor.getValue()

    const event = new CustomEvent('wa-editor-save', {
      detail: {
        value,
        editor,
      },
    })
    window.dispatchEvent(event)
  })

  monaco.editor.addKeybindingRule({
    keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    command: 'wa.editor.save',
  })
}

function registerCommentAction(monaco: typeof Monaco) {
  monaco.editor.registerCommand('wa.editor.toggleComment', () => {
    const editorInst = monaco.editor.getEditors()
    if (!editorInst || editorInst.length === 0)
      return

    const editor = editorInst.find(e => e.hasTextFocus())
    if (!editor)
      return

    const selection = editor.getSelection()
    if (!selection)
      return

    const event = new CustomEvent('wa-editor-toggle-comment', {
      detail: {
        editor,
        selection,
      },
    })
    window.dispatchEvent(event)
  })

  monaco.editor.addKeybindingRule({
    keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash,
    command: 'wa.editor.toggleComment',
  })
}

export function registerEditorActions(monaco: typeof Monaco) {
  registerSaveAction(monaco)
  registerCommentAction(monaco)
}
