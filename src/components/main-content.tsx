import { useIsMobile } from '../hooks/useIsMobile'
import { EditorPane } from './editor/editor-pane'
import { PreviewPane } from './preview/preview-pane'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'

export function MainContent() {
  const isMobile = useIsMobile()
  const direction = isMobile ? 'vertical' : 'horizontal'

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
