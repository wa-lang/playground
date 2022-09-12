(() => {
  Split(['#split-code', '#split-console'], {
    sizes: [60, 40],
    gutterSize: 13,
    gutterAlign: 'start'
  })

  Split(['#split-js', '#split-output'], {
    direction: 'vertical',
    sizes: [40, 60],
    gutterSize: 13,
    gutterAlign: 'start',
  })
})()