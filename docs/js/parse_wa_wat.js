const FEATURES = {
  'exceptions': false,
  'mutable_globals': true,
  'sat_float_to_int': false,
  'sign_extension': false,
  'simd': false,
  'threads': false,
  'multi_value': true,
  'tail_call': false,
  'bulk_memory': false,
  'reference_types': false
};

let waPrint = ""
const importsObject = {
  wa_js_env: new function () {
    this.waPrintI32 = (i) => {
      waPrint += i
    }
    this.waPrintRune = (c) => {
      let ch = String.fromCodePoint(c);
      if (ch == '\n') {
        waPrint += '\n'
      }
      else {
        waPrint += ch
      }
    }
    this.waPuts = (prt, len) => {
      let s = window.waApp.getString(prt, len);
      waPrint += s
      console.log(s);
    }
  }
}

async function parseWaWat() {
  const wabt = await WabtModule();

  const waCompile = () => {
    let outputLog = '';
    try {
      var module = wabt.parseWat('wa.wat', window.waWat, FEATURES);
      module.resolveNames();
      module.validate(FEATURES);
      const binaryOutput = module.toBinary({ log: true, write_debug_names: true });
      outputLog = binaryOutput.log;
      return binaryOutput.buffer
    } catch (e) {
      outputLog += e.toString();
    } finally {
      if (module) module.destroy();
    }
  }

  const binary = waCompile();
  await run(binary);

  window['waPrint'] = waPrint

  const outActiveDom = document.querySelector('.output-active')
  const outIndex = Array.prototype.indexOf.call(outActiveDom.parentNode.children, outActiveDom)
  const outInnerHTML = outIndex === 0 ? 'waPrint' : 'waWat'
  const waOutputCode = document.getElementById('wa-output-code')
  const isError = window[outInnerHTML].includes('TypeError: WebAssembly.Module()')
  waOutputCode.innerHTML = window[isError ? 'waWat' : outInnerHTML]
}

async function run(binary) {
  if (binary === null) return;
  try {
    const module = await WebAssembly.compile(binary);
    const wasmInst = await WebAssembly.instantiate(module, importsObject);
    window.waApp.init(wasmInst);
    const { _start } = wasmInst.exports;
    _start()  //*/

  } catch (e) {
    waPrint = e.toString()
  }
}