import { useWasmStore } from '@/stores/wasm'
import JSZip from 'jszip'
import { importsObject } from './import-obj'

type TWasmInst = WebAssembly.Instance & {
  exports: {
    '_start': () => void
    '_main': () => void
  }
}

const zip = new JSZip()
const isDEV = import.meta.env.DEV || import.meta.env.MODE === 'development'
const WASM_ZIP_URL = isDEV
  ? './wa.wasm.zip'
  : 'https://wa-lang.org/wa/wa-js/wa.wasm.zip'

export async function initWaWasm() {
  const { wasmInst, go, actions } = useWasmStore.getState()

  if (wasmInst)
    return

  const wasmZip = await (await fetch(WASM_ZIP_URL)).blob()
  const wasmFile = (await zip.loadAsync(wasmZip)).file('wa.wasm')
  if (!wasmFile)
    throw new Error('wa.wasm not found in zip')

  const wasmBinary = await wasmFile.async('arraybuffer')
  const wasmResponse = new Response(wasmBinary, {
    headers: {
      'Content-Type': 'application/wasm',
    },
  })

  const result = await WebAssembly.instantiateStreaming(wasmResponse, go.importObject)
  actions.updateWasmInst(result.instance)
  actions.updateWasmMod(result.module)
  await runWa()
}

export async function runWa() {
  const { wasmInst, wasmMod, go, actions } = useWasmStore.getState()
  await go.run(wasmInst)
  const newWasmInst = await WebAssembly.instantiate(wasmMod as WebAssembly.Module, go.importObject)
  actions.updateWasmInst(newWasmInst)

  window.__WA_PRINT__ = ''

  const binary = window.__WA_WASM__
  if (binary === null)
    return

  try {
    const module = await WebAssembly.compile(binary)
    const wasmInst = await WebAssembly.instantiate(module, importsObject) as TWasmInst
    window.__WA_APP__.init(wasmInst)
    wasmInst.exports._start()
    wasmInst.exports['_main']()
    useWasmStore.getState().actions.updateOutput(window.__WA_PRINT__)
    useWasmStore.getState().actions.updateWat(window.__WA_WAT__)
  }
  catch (e) {
    console.error(e)
    useWasmStore.getState().actions.updateOutput('Code error')
    useWasmStore.getState().actions.updateWat(null)
  }
}
