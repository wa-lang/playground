const AGENT_RE = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i

const isMobile = () => {
  return (navigator.userAgent.match(AGENT_RE))
    ? true
    : false
}