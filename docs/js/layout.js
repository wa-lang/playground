window.onload = function () {
  document.querySelector('.wa-loading').style.display = 'none';
};

function updateTheme() {
  const lightIcon = `<svg width="1.7em" height="1.7em" viewBox="0 0 24 24">
    <path fill="currentColor"
      d="M12 15q1.25 0 2.125-.875T15 12q0-1.25-.875-2.125T12 9q-1.25 0-2.125.875T9 12q0 1.25.875 2.125T12 15Zm0 2q-2.075 0-3.537-1.463Q7 14.075 7 12t1.463-3.538Q9.925 7 12 7t3.538 1.462Q17 9.925 17 12q0 2.075-1.462 3.537Q14.075 17 12 17ZM2 13q-.425 0-.712-.288Q1 12.425 1 12t.288-.713Q1.575 11 2 11h2q.425 0 .713.287Q5 11.575 5 12t-.287.712Q4.425 13 4 13Zm18 0q-.425 0-.712-.288Q19 12.425 19 12t.288-.713Q19.575 11 20 11h2q.425 0 .712.287q.288.288.288.713t-.288.712Q22.425 13 22 13Zm-8-8q-.425 0-.712-.288Q11 4.425 11 4V2q0-.425.288-.713Q11.575 1 12 1t.713.287Q13 1.575 13 2v2q0 .425-.287.712Q12.425 5 12 5Zm0 18q-.425 0-.712-.288Q11 22.425 11 22v-2q0-.425.288-.712Q11.575 19 12 19t.713.288Q13 19.575 13 20v2q0 .425-.287.712Q12.425 23 12 23ZM5.65 7.05L4.575 6q-.3-.275-.288-.7q.013-.425.288-.725q.3-.3.725-.3t.7.3L7.05 5.65q.275.3.275.7q0 .4-.275.7q-.275.3-.687.287q-.413-.012-.713-.287ZM18 19.425l-1.05-1.075q-.275-.3-.275-.712q0-.413.275-.688q.275-.3.688-.287q.412.012.712.287L19.425 18q.3.275.288.7q-.013.425-.288.725q-.3.3-.725.3t-.7-.3ZM16.95 7.05q-.3-.275-.287-.688q.012-.412.287-.712L18 4.575q.275-.3.7-.288q.425.013.725.288q.3.3.3.725t-.3.7L18.35 7.05q-.3.275-.7.275q-.4 0-.7-.275ZM4.575 19.425q-.3-.3-.3-.725t.3-.7l1.075-1.05q.3-.275.713-.275q.412 0 .687.275q.3.275.288.688q-.013.412-.288.712L6 19.425q-.275.3-.7.287q-.425-.012-.725-.287ZM12 12Z" />
    </svg>`
  const nightIcon = `<svg width="1.7em" height="1.7em" viewBox="0 0 24 24">
    <path fill="currentColor"
      d="M9.5 4h-.525q-.25 0-.475.05q1.425 1.65 2.213 3.687Q11.5 9.775 11.5 12t-.787 4.262Q9.925 18.3 8.5 19.95q.225.05.475.05H9.5q3.325 0 5.663-2.337Q17.5 15.325 17.5 12t-2.337-5.663Q12.825 4 9.5 4Zm10 8q0 2.075-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q11.575 22 9.5 22q-.8 0-1.675-.15t-1.675-.425q-.3-.125-.475-.387q-.175-.263-.175-.588q0-.225.088-.425q.087-.2.262-.325q1.775-1.475 2.712-3.488Q9.5 14.2 9.5 12q0-2.2-.938-4.213Q7.625 5.775 5.85 4.3q-.175-.125-.262-.325q-.088-.2-.088-.425q0-.325.175-.588q.175-.262.475-.387q.8-.275 1.675-.425Q8.7 2 9.5 2q2.075 0 3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175q.788 1.825.788 3.9Zm-8 0Z" />
    </svg>`

  const iconDom = document.querySelector('.wa-theme-icon')
  const isDark = document.body.classList.contains('dark-theme')
  const mode = isDark ? 'remove' : 'toggle'
  document.body.classList[mode]('dark-theme')
  iconDom.innerHTML = isDark ? lightIcon : nightIcon
}

(() => {
  Split(['#split-code', '#split-output'], {
    direction: 'horizontal',
    gutterSize: 13,
    gutterAlign: 'start'
  })

  const outputNavChild = document.querySelector('.output-nav-inner').children
  const waOutputCode = document.getElementById('wa-output-code')
  outputNavChild[0].classList.add('output-active')
  for (let i = 0; i < outputNavChild.length; i++) {
    const curKey = i == 0 ? 'waPrint' : 'waWat'
    outputNavChild[i].onclick = function () {
      let outputActiveDom = document.querySelector('.output-active')
      outputActiveDom.classList.remove('output-active')
      this.classList.add('output-active')
      waOutputCode.innerHTML = window[curKey] ?? 'ReferenceError: parseWat failed'
    }
  }
})()
