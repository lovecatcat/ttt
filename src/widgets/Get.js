// get 参数
var $_GET = (function () {
  var url = window.document.location.href.toString().split('#')
  var u = url[0].split('?')
  if (typeof u[1] === 'string') {
    u = u[1].split('&')
    var get = {}
    for (var i in u) {
      var j = u[i].split('=')
      get[j[0]] = j[1]
    }
    return get
  } else {
    return {}
  }
})()

export default $_GET

