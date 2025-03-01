import { create } from 'zustand'
import { createSelectors } from './withSelectors'

interface IStore {
  wasmInst: WebAssembly.Instance | null
  wasmMod: WebAssembly.Module | null
  go: any
  output: string
  wat: string | null
  actions: {
    updateWasmInst: (wasmInst: WebAssembly.Instance) => void
    updateWasmMod: (wasmMod: WebAssembly.Module) => void
    updateGo: (go: any) => void
    updateOutput: (output: string) => void
    updateWat: (wat: string | null) => void
  }
}

const initialState: Omit<IStore, 'actions'> = {
  wasmInst: null,
  wasmMod: null,
  go: new window.Go(),
  output: '',
  wat: null,
}

const wasmStore = create<IStore>()(
  set => ({
    ...initialState,
    actions: {
      updateWasmInst: wasmInst => set({ wasmInst }),
      updateWasmMod: wasmMod => set({ wasmMod }),
      updateGo: go => set({ go }),
      updateOutput: output => set({ output }),
      updateWat: wat => set({ wat }),
    },
  }),
)

export const useWasmStore = createSelectors(wasmStore)
