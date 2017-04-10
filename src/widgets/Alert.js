export default {
  install(Vue) {
    let Alert = Vue.extend({
      name: 'alert',
      template: `
      <div class="app-dialog" v-if="isShow">
        <div class="am-dialog-mask show" @click="hide"></div>
        <div class="am-inform">
          <div class="am-inform-content">{{title}}</div>
          <div class="am-inform-operation">
            <a class="am-inform-button" @click="go">{{btnTxt}}</a>
          </div>
        </div>
      </div>
      `,
      data() {
        // <router-link :to="btnUrl">{{btnTxt}}</router-link>
        return {
          title: '',
          btnTxt: '',
          btnUrl: '',
          isShow: false
        }
      },
      methods: {
        show(title, btnUrl, btnTxt) {
          this.title = title
          this.btnUrl = btnUrl
          this.btnTxt = btnTxt || '知道了'
          this.isShow = true
        },
        go() {
          if (this.btnUrl) {
            this.$router.push(this.btnUrl)
          } else {
            this.hide()
          }
        },
        hide() {
          this.title = ''
          this.btnUrl = ''
          this.btnTxt = ''
          this.isShow = false
        }
      },
      deactivated() {
        this.hide()
      }
    })
    let div = document.createElement('div')
    let el = document.body.appendChild(div)
    Vue.prototype.$alert = new Alert().$mount(el)
  }
}

