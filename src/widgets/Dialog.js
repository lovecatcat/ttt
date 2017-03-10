export default {
  install(Vue) {
    let Dialog = Vue.extend({
      data() {
        return {
          title: '',
          brief: ''
        }
      },
      template: `
      <div class="app-dialog" v-if="title">
        <div class="am-dialog-mask show"></div>
        <div class="am-dialog show" role="dialog">
          <div class="am-dialog-wrap" role="document">
            <div class="am-dialog-header">
              <h3>{{title}}</h3>
            </div>
            <div class="am-dialog-body" v-if="brief">
              <p class="am-dialog-brief">{{brief}}</p>
            </div>
            <div class="am-dialog-footer">
              <a class="am-dialog-button" role="button" @click="title=''">取消</a>
              <a class="am-dialog-button" role="button" @click="close">确定</a>
            </div>
          </div>
        </div>
      </div>
      `,
      methods: {
        open(t, b, cb) {
          var vm = this
          vm.title = t
          vm.brief = b
          vm.close = function () {
            vm.title = ''
            cb()
          }
        }
      }
    })
    let div = document.createElement('div')
    let el = document.body.appendChild(div)
    Vue.prototype.$dialog = new Dialog().$mount(el)
  }
}

