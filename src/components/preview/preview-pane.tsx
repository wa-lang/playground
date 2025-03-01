import { useWaMonaco } from '@/hooks/useWaMonaco'
import { initWaWasm } from '@/lib/wawasm'
import { useConfigStore } from '@/stores/config'
import { useWasmStore } from '@/stores/wasm'
import { AppWindowMac, Cpu, FileType } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SkeletonPreview } from '../skeleton-preview'
import { MemoryPreview } from './memory'
import { OutputPreview } from './output'
import { WatPreview } from './wat'

const TABS = [
  {
    icon: <AppWindowMac className="size-5" />,
    label: 'Preview',
    value: 'output',
  },
  {
    icon: <FileType className="size-5" />,
    label: 'WAT',
    value: 'wat',
  },
  {
    icon: <Cpu className="size-5" />,
    label: 'Memory',
    value: 'memory',
  },
] as const

export function PreviewPane() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'output' | 'wat' | 'memory'>('output')
  const { output, wat } = useWasmStore()

  const monaco = useWaMonaco()
  const { theme } = useConfigStore()

  useEffect(() => {
    initWaWasm().then(() => {
      setLoading(false)
    })
  }, [])

  return (
    <div className="h-full">
      <div className="p-2 border-b border-dashed flex gap-2 items-center">
        {TABS.map(tab => (
          <button
            key={tab.value}
            className={`p-2 flex gap-2 items-center ${activeTab === tab.value ? 'bg-foreground/5' : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.icon}
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
      {loading
        ? <SkeletonPreview />
        : (
            <div className="h-full w-full">
              {activeTab === 'output'
                ? <OutputPreview output={output} />
                : activeTab === 'wat'
                  ? <WatPreview wat={wat} monaco={monaco} theme={theme} />
                  : <MemoryPreview />}
            </div>
          )}
    </div>
  )
}
