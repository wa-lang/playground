// 版权 @2024 凹语言 作者。保留所有权利。

const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  waWasmZipUrl: () => 'https://wa-lang.org/wa/wa-js/wa.wasm.zip'
  // we can also expose variables, not just functions
})
