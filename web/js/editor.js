(() => {
  var waEditor = CodeMirror(document.getElementById('wa-editor'), {
    mode: 'go',
    lineNumbers: true,
    tabSize: 2,
  });

  var jsEditor = CodeMirror(document.getElementById('js-editor'), {
    value: "",
    mode: "javascript",
    lineNumbers: true,
    tabSize: 2,
    styleActiveLine: true,
  });
})()