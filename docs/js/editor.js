(() => {
  var waEditor = CodeMirror(document.getElementById('wa-editor'), {
    mode: 'wa',
    lineNumbers: true,
    tabSize: 2,
    theme: "wa",
  });

  waEditor.setValue(`# 版权 @2019 凹语言 作者。保留所有权利。

fn main() {
  a := 0.0
  for y := 1.5; y > -1.5; y = y - 0.1 {
    for x := -1.5; x < 1.5; x = x + 0.05 {
      a = x*x + y*y - 1.0
      if a*a*a < x*x*y*y*y {
        print('@')
      } else {
        print(' ')
      }
    }
    println()
  }
}
`)
  window['waCode'] = waEditor.getValue()
  waEditor.on('change', (cm, change) => {
    window['waCode'] = cm.getValue()
  })
})()