if (!WebAssembly.instantiateStreaming) {
  WebAssembly.instantiateStreaming = async (resp, importObject) => {
    const source = await (await resp).arrayBuffer();
    return await WebAssembly.instantiate(source, importObject);
  };
}

const go = new Go();
let wasmMod, wasmInst;

WebAssembly.instantiateStreaming(fetch("assets/wa.out.wasm"), go.importObject).then((result) => {
  wasmMod = result.module;
  wasmInst = result.instance;
  wa2wat()
}).catch((err) => {
  console.error(err);
});

async function wa2wat() {
  await go.run(wasmInst);
  wasmInst = await WebAssembly.instantiate(wasmMod, go.importObject);
  await parseWaWat()
}