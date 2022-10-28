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

class WaApp {
	constructor() {
		this._inst = null;
	}
  
	Init(instance) {
		this._inst = instance;
  }

	async Run(instance) {
		this._inst = instance;
		this._inst.exports.main();
	}

	Mem() {
		return this._inst.exports.memory;
	}
	MemView(addr, len) {
		return new DataView(this._inst.exports.memory.buffer, addr, len);
	}
	MemUint8Array(addr, len) {
		return new Uint8Array(this.Mem().buffer, addr, len)
	}

	GetString(addr, len) {
		return new TextDecoder("utf-8").decode(this.MemView(addr, len));
	}
	SetString(addr, len, s) {
		const bytes = new TextEncoder("utf-8").encode(s);
		if(len > bytes.length) { len = bytes.length; }
		this.MemUint8Array(addr, len).set(bytes);
	}
}

const waApp = new WaApp();

async function parseWaWat() {
  const wabt = await WabtModule();
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
        let s = waApp.GetString(ptr, len);
        console.log(s);
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
      waApp.Init(wasmInst);

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
  const isError = window[outInnerHTML].includes('TypeError: WebAssembly.Module()')
  waOutputCode.innerHTML = window[isError ? 'waWat' : outInnerHTML]
}