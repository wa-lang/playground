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
  syscall_js: new function () {
    this.print_bool = (v) => {
      if(v) {
        __WA_PRINT__ += 'true';
      } else {
        __WA_PRINT__ += 'false';
      }
    }
    this.print_i32 = (i) => {
      __WA_PRINT__ += i;
    }
    this.print_u32 = (i) => {
      __WA_PRINT__ += i;
    }
    this.print_ptr = (i) => {
      __WA_PRINT__ += i;
    }
    this.print_i64 = (i) => {
      __WA_PRINT__ += i;
    }
    this.print_u64 = (i) => {
      __WA_PRINT__ += i;
    }
    this.print_f32 = (i) => {
      __WA_PRINT__ += i;
    }
    this.print_f64 = (i) => {
      __WA_PRINT__ += i;
    }
    this.print_rune = (c) => {
      let ch = String.fromCodePoint(c);
      if (ch == '\n') {
        __WA_PRINT__ += '\n'
      }
      else {
        __WA_PRINT__ += ch
      }
    }
    this.print_str = (prt, len) => {
      let s = window.waApp.getString(prt, len);
      __WA_PRINT__ += s
    }
    this.proc_exit = (i) => {
      // exit(i);
    }
  }
}

async function parseWaWat() {
  const binary = window['__WA_WASM__'];
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
    wasmInst.exports['__main__.main']();
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