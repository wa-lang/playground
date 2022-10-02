(() => {
  var waEditor = CodeMirror(document.getElementById('wa-editor'), {
    mode: 'wa',
    lineNumbers: true,
    tabSize: 2,
    theme: "wa",
  });

  waEditor.setValue(EG_HELLO)
  window['waCode'] = waEditor.getValue()
  waEditor.on('change', (cm, change) => {
    window['waCode'] = cm.getValue()
  })

  const waCodesDom = document.getElementById('wa-codes')
  waCodesDom.addEventListener('click', (e) => {
    const codeActiveDom = document.querySelector('.code-active')
    codeActiveDom.classList.remove('code-active')
    const target = e.target
    const codeName = target.innerText.toUpperCase().replace(/.WA/g, '')
    waEditor.setValue(eval(`EG_${codeName}`))
    target.classList.add('code-active')
    wa2wat()
  })
})()

