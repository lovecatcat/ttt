import PreviewComponent from './preview.vue'
export default {
  install(Vue) {
    let Preview = Vue.extend(PreviewComponent)
    var $vm = new Preview({
      el: document.createElement('div')
    })
    document.body.appendChild($vm.$el)
    const preview = {
      open(index, list, params) {
        $vm.open(index, list, params)
      },
      close() {
        $vm.close()
      }
    }
    Vue.$preview = preview
    Vue.mixin({
      created: function () {
        this.$preview = Vue.$preview
      }
    })
  }
}

