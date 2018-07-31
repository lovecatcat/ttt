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
          <div class="am-dialog-wrap am-dialog-warp-config" role="document">
            <div class="am-dialog-header">
              {{title}}
            </div>
            <div class="am-dialog-body" v-if="brief">
              <p class="am-dialog-brief">{{brief}}</p>
            </div>
            <div class="am-dialog-footer">
              <a class="am-dialog-button" role="button" @click="no">取消</a>
              <a class="am-dialog-button" role="button" @click="yes">确定</a>
            </div>
          </div>
        </div>
      </div>
      `,
      methods: {
        open(t, b, ycb, ncb) {
          var vm = this
          vm.title = t
          vm.brief = b
          vm.yes = function () {
            vm.title = ''
            ycb && ycb()
          }
          vm.no = function () {
            vm.title = ''
            ncb && ncb()
          }
        }
      }
    })
    let div = document.createElement('div')
    let el = document.body.appendChild(div)
    Vue.prototype.$dialog = new Dialog().$mount(el)
  }
}

