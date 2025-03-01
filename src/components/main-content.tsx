import { useEffect, useState } from 'react'
import { EditorPane } from './editor/editor-pane'
import { PreviewPane } from './preview/preview-pane'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'

export function MainContent() {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal')

  useEffect(() => {
    const checkMobile = () => {
      setDirection(window.innerWidth < 768 ? 'vertical' : 'horizontal')
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <ResizablePanelGroup direction={direction} className="h-full">
      <ResizablePanel defaultSize={50} minSize={5}>
        <EditorPane />
      </ResizablePanel>
      <ResizableHandle className="hover:after:bg-foreground/5 after:w-3 z-10" />
      <ResizablePanel defaultSize={50} minSize={5}>
        <PreviewPane />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
