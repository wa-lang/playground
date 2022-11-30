/*****************************************
*                                        *
*               init editor              *
*                                        *
*****************************************/
var waEditor = CodeMirror(document.getElementById('wa-editor'), {
  mode: 'wa',
  lineNumbers: true,
  tabSize: 2,
  theme: "wa",
});

(async () => {
  /*****************************************
  *                                        *
  *              init examples             *
  *                                        *
  *****************************************/
  const examples = await fetch('assets/examples.json').then(res => res.json());
  window['__WA_EXAMPLES__'] = examples;

  const select = document.querySelector('#wa-examples select');
  Object.keys(examples).forEach((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.innerText = key;
    select.appendChild(option);
  });
  select.selectedIndex = 0;
  select.addEventListener('change', (e) => {
    const key = e.target.value;
    const code = examples[key];
    window['__WA_CODE__'] = code;
    waEditor.setValue(code);
    wa2wat();
  })

  const firstKey = Object.keys(examples)[0];
  waEditor.setValue(examples[firstKey]);
  window['__WA_CODE__'] = waEditor.getValue()
  waEditor.on('change', (cm, change) => {
    window['__WA_CODE__'] = cm.getValue()
  })

  /*****************************************
  *                                        *
  *               init output              *
  *                                        *
  *****************************************/
  const outputNavChild = document.querySelector('.output-nav-inner').children
  const waOutputCode = document.getElementById('wa-output-code')
  outputNavChild[0].classList.add('output-active')
  for (let i = 0; i < outputNavChild.length; i++) {
    const curKey = i == 0 ? '__WA_PRINT__' : '__WA_WAT__'
    outputNavChild[i].onclick = function () {
      let outputActiveDom = document.querySelector('.output-active')
      outputActiveDom.classList.remove('output-active')
      this.classList.add('output-active')
      const isError = window[curKey].includes('TypeError: WebAssembly.Module()')
      waOutputCode.innerHTML = window[isError ? '__WA_WAT__' : curKey]
    }
  }

})()

/*****************************************
*                                        *
*                init wasm               *
*                                        *
*****************************************/
if (!WebAssembly.instantiateStreaming) {
  WebAssembly.instantiateStreaming = async (resp, importObject) => {
    const source = await (await resp).arrayBuffer();
    return await WebAssembly.instantiate(source, importObject);
  };
}

const go = new Go();
let wasmMod, wasmInst;

WebAssembly.instantiateStreaming(fetch("https://wa-lang.org/wa/wa.wasm"), go.importObject).then((result) => {
  wasmMod = result.module;
  wasmInst = result.instance;
  document.querySelector('.wa-output-loading').style.display = 'none'
  wa2wat()
}).catch((err) => {
  console.error(err);
});

async function wa2wat() {
  __WA_PRINT__ = ''
  await go.run(wasmInst);
  wasmInst = await WebAssembly.instantiate(wasmMod, go.importObject);
  await parseWaWat()
}

async function waFmt() {
  waEditor.setValue(window['__WA_FMT_CODE__'])
}