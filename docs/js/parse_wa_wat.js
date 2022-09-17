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


async function parseWaWat() {
  const wabt = await WabtModule();
  let waPrint = ""

  let importsObject = {
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
        // todo
      }
    }
  }

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

  const run = (binary) => {
    if (binary === null) return;
    try {
      const module = new WebAssembly.Module(binary)
      const wasmInst = new WebAssembly.Instance(module, importsObject);
      const { main } = wasmInst.exports;
      main()
    } catch (e) {
      waPrint = e.toString()
    }
  }

  const binary = waCompile();
  run(binary);

  window['waPrint'] = waPrint

  const outActiveDom = document.querySelector('.output-active')
  const outIndex = Array.prototype.indexOf.call(outActiveDom.parentNode.children, outActiveDom)
  const outInnerHTML = outIndex === 0 ? 'waPrint' : 'waWat'
  const waOutputCode = document.getElementById('wa-output-code')
  waOutputCode.innerHTML = window[outInnerHTML] ?? 'ReferenceError: parseWat failed'

}