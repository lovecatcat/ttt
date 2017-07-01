export default {
  install(Vue) {
    var storage = {
      fetch(KEY) {
        return JSON.parse(localStorage.getItem(KEY)) || {}
      },
      save(KEY, data) {
        if (typeof data === 'object') {
          data = JSON.stringify(data)
        }
        return localStorage.setItem(KEY, data)
      },
      remove(KEY) {
        return localStorage.removeItem(KEY)
      },
      clear() {
        return localStorage.clear()
      }
    }
    Vue.prototype.$storage = storage
  }
}

