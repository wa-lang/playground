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

var __WA_PRINT__ = ""
const importsObject = {
  wa_js_env: new function () {
    this.waPrintI32 = (i) => {
      __WA_PRINT__ += i
    }
    this.waPrintRune = (c) => {
      let ch = String.fromCodePoint(c);
      if (ch == '\n') {
        __WA_PRINT__ += '\n'
      }
      else {
        __WA_PRINT__ += ch
      }
    }
    this.waPuts = (prt, len) => {
      let s = window.waApp.getString(prt, len);
      __WA_PRINT__ += s
    }
  }
}

let libwabtJS;
async function loadLibwabt() {
  if (libwabtJS) {
    eval(libwabtJS);
    return WabtModule()
  }
  const libwabtZip = await (await fetch("assets/libwabt.js.zip")).blob();
  libwabtJS = await (await JSZip.loadAsync(libwabtZip)).file("libwabt.js").async("string");
  eval(libwabtJS);
  return WabtModule();
}

async function parseWaWat() {
  const wabt = await loadLibwabt();

  const waCompile = () => {
    let outputLog = '';
    try {
      var module = wabt.parseWat('wa.wat', window['__WA_WAT__'], FEATURES);
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

  window['__WA_PRINT__'] = __WA_PRINT__

  updateOutput()
}

async function run(binary) {
  if (binary === null) return;
  try {
    const module = await WebAssembly.compile(binary);
    const wasmInst = await WebAssembly.instantiate(module, importsObject);
    window.waApp.init(wasmInst);
    wasmInst.exports._start();
  } catch (e) {
    __WA_PRINT__ = e.toString()
  }
}

function updateOutput() {
  const outActiveDom = document.querySelector('.output-active')
  const outIndex = Array.prototype.indexOf.call(outActiveDom.parentNode.children, outActiveDom)
  const curKey = outIndex === 0 ? '__WA_PRINT__' : '__WA_WAT__'
  const waOutputCode = document.getElementById('wa-output-code')
  const isError = window['__WA_ERROR__'] !== ''
  const innerHTML = window[isError ? '__WA_ERROR__' : curKey]
  waOutputCode.innerHTML = isError ? fmtErrMsg(innerHTML) : innerHTML
}