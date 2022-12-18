/*****************************************
*                                        *
*               init editor              *
*                                        *
*****************************************/
var waEditor = CodeMirror(document.getElementById('wa-editor'), {
  mode: 'wa',
  lineNumbers: true,
  tabSize: 4,
  theme: "wa",
});



/*****************************************
 *                                        *
 *              init examples             *
 *                                        *
*****************************************/
const __WA_EXAMPLES__ = {"hello":"# 版权 @2019 凹语言 作者。保留所有权利。\n\nimport \"fmt\"\nimport \"runtime\"\n\nfn main {\n\tprintln(\"你好，凹语言！\", runtime.WAOS)\n\tprintln(add(40, 2))\n\n\tfmt.Println(1+1)\n}\n\nfn add(a: i32, b: i32) => i32 {\n\treturn a+b\n}","count":"# 版权 @2019 凹语言 作者。保留所有权利。\n\nfn main() {\n  print(\"30以内的质数：\")\n\tfor n := 2; n <= 30; n = n + 1 {\n\t\tvar isPrime int = 1\n\t\tfor i := 2; i*i <= n; i = i + 1 {\n\t\t\tif x := n % i; x == 0 {\n\t\t\t\tisPrime = 0\n\t\t\t}\n\t\t}\n\t\tif isPrime != 0 {\n\t\t\tprint(n)\n      if n != 29 {\n        print(\"、\")\n      }\n\t\t}\n\t}\n}","heart":"# 版权 @2019 凹语言 作者。保留所有权利。\n\nfn main() {\n  a := 0.0\n  for y := 1.5; y > -1.5; y = y - 0.15 {\n    for x := -1.5; x < 1.5; x = x + 0.07 {\n      a = x*x + y*y - 1.0\n      if a*a*a < x*x*y*y*y {\n        print(\"@\")\n      } else {\n        print(\" \")\n      }\n    }\n    println()\n  }\n}","brainfuck":"# 版权 @2019 凹语言 作者。保留所有权利。\n\nfn main() {\n\t# print hi\n\tconst code = \"++++++++++[>++++++++++<-]>++++.+.\"\n\tvm := NewBrainFuck(code)\n\tvm.Run()\n}\n\ntype BrainFuck struct {\n\tmem  :[30000]byte\n\tcode :string\n\tpos  :int\n\tpc   :int\n}\n\nfn NewBrainFuck(code: string) => *BrainFuck {\n\treturn &BrainFuck{code: code}\n}\n\nfn BrainFuck.Run() {\n\tfor ; this.pc != len(this.code); this.pc++ {\n\t\tswitch x := this.code[this.pc]; x {\n\t\tcase '>':\n\t\t\tthis.pos++\n\t\tcase '<':\n\t\t\tthis.pos--\n\t\tcase '+':\n\t\t\tthis.mem[this.pos]++\n\t\tcase '-':\n\t\t\tthis.mem[this.pos]--\n\t\tcase '[':\n\t\t\tif this.mem[this.pos] == 0 {\n\t\t\t\tthis.loop(1)\n\t\t\t}\n\t\tcase ']':\n\t\t\tif this.mem[this.pos] != 0 {\n\t\t\t\tthis.loop(-1)\n\t\t\t}\n\t\tcase '.':\n\t\t\tprint(rune(this.mem[this.pos]))\n\t\tcase ',':\n\t\t\t# TODO: support read byte\n\t\t}\n\t}\n\treturn\n}\n\nfn BrainFuck.loop(inc: int) {\n\tfor i := inc; i != 0; this.pc += inc {\n\t\tswitch this.code[this.pc+inc] {\n\t\tcase '[':\n\t\t\ti++\n\t\tcase ']':\n\t\t\ti--\n\t\t}\n\t}\n}\n","closure":"# 版权 @2019 凹语言 作者。保留所有权利。\n\ntype FP fn (i: i32) => i32\n\ntype ST struct {\n\ti: i32\n}\n\nfn ST.meth(p: i32) => i32 {\n\tthis.i += p\n\treturn this.i\n}\n\nvar g_f: FP\n\nfn main() {\t\n\tvar o ST\n\to.i = 11\n\tg_f = o.meth\n\tprintln(g_f(11))  # 22\n\tprintln(o.i)  # 22\n\t\n\tn := i32(21)\n\tg_f = fn(i: i32) => i32 {\n\t\tn += i\n\t\treturn n\n\t}\n\tprintln(g_f(22))  # 43\n\tprintln(n)  # 43\n\t\n\tfn(i: i32) {\n\t\tn += i\n\t}(22)\n\tprintln(n)  # 65\n\t\n\tg_f = Double\n\tprintln(g_f(13))  # 26\n}\n\nfn Double(i: i32) => i32 {\n\treturn i * 2\n}\n"}

const select = document.querySelector('#wa-examples select');
Object.keys(__WA_EXAMPLES__).forEach((key) => {
  const option = document.createElement('option');
  option.value = key;
  option.innerText = key;
  select.appendChild(option);
});
select.selectedIndex = 0;
select.addEventListener('change', (e) => {
  const key = e.target.value;
  const code = __WA_EXAMPLES__[key];
  window['__WA_CODE__'] = code;
  waEditor.setValue(code);
  wa2wat();
})

const firstKey = Object.keys(__WA_EXAMPLES__)[0];
waEditor.setValue(__WA_EXAMPLES__[firstKey]);
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
