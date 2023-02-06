(() => {
  const AGENT_RE = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  const isMobile = () => { return (navigator.userAgent.match(AGENT_RE)) ? true : false }
  const direction = isMobile() ? "vertical" : 'horizontal'
  const flexDirection = isMobile() ? "column" : "row"

  const splitDom = document.querySelector('.split')
  splitDom.style.flexDirection = flexDirection

  Split(['#split-code', '#split-output'], {
    direction: direction,
    gutterSize: 13,
    gutterAlign: 'start'
  })

  document.querySelector('.wa-loading').style.display = 'none';
  const localThemes = localStorage.getItem('vitepress-theme-appearance')
  const curTheme = localThemes === 'auto'
    ? window.matchMedia(`(prefers-color-scheme: dark)`).matches
    : localThemes

  initNavIcons()
  initOtherIcons()
  updateThemeContent(curTheme)
})()

function updateTheme() {
  const isDark = document.body.classList.contains('dark-theme')
  updateThemeContent(isDark ? 'light' : 'dark')
}

function updateThemeContent(theme) {
  const waLightIcon = waPlayTheme.light
  const waDarkIcon = waPlayTheme.dark
  const isLight = theme === 'light'
  const iconDom = document.querySelector('.wa-theme-icon')
  iconDom.innerHTML = isLight ? waLightIcon : waDarkIcon
  const mode = isLight ? 'remove' : 'toggle'
  document.body.classList[mode]('dark-theme')
  localStorage.setItem('vitepress-theme-appearance', isLight ? 'light' : 'dark')
}

function initNavIcons() {
  const navDom = document.querySelector('.icon-nav')
  navDom.querySelectorAll('li').forEach((li) => {
    const type = li.getAttribute('data-type')
    const config = waPlayNavConfig[type]
    const a = document.createElement('a')
    if (config) {
      if (config.link) {
        a.setAttribute('href', config.link)
        a.setAttribute('target', '_blank')
      }
      if (type === 'theme') {
        a.setAttribute('class', 'wa-theme-icon')
        a.setAttribute('onclick', 'updateTheme()')
      }
      a.innerHTML = config.icon
    }
    li.appendChild(a)
  })
}

function initOtherIcons() {
  const fmtDom = document.getElementById('wa-fmt')
  fmtDom.appendChild(createIcon(waPlayOutputConfig['fmt'].icon))

  const compileDom = document.getElementById('wa-compile')
  compileDom.appendChild(createIcon(waPlayOutputConfig['run'].icon))

  const resultDom = document.querySelector('.output-nav-inner')

  const outputDom = document.createElement('span')
  outputDom.innerHTML = `${waPlayOutputConfig['output'].icon} OUTPUT`
  resultDom.appendChild(outputDom)

  const watDom = document.createElement('span')
  watDom.innerHTML = `${waPlayOutputConfig['wat'].icon} WAT`
  resultDom.appendChild(watDom)
}

function createIcon(icon) {
  const div = document.createElement('div')
  div.innerHTML = icon
  return div.firstChild
}
