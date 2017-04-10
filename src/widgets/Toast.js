export default {
  install(Vue) {
    let Toast = Vue.extend({
      name: 'toast',
      data() {
        return {
          text: null,
          type: null,
          show: false
        }
      },
      template: `
        <div class="am-toast" v-if='show'>
          <div class="am-toast-text">
            <span v-if="type" class="am-icon toast" :class="type"></span> {{text}}
          </div>
        </div>
      `,
      methods: {
        open(text, type, time = 2000) {
          if (text || type) {
            this.text = text
            this.type = type
            this.show = true
            if (type != "loading") {
              setTimeout(() => {
                this.text = ''
                this.type = ''
                this.show = false
              }, time)
            }
          } else {
            this.show = false
          }
        },
        close() {
          this.text = ''
          this.type = ''
          this.show = false
        }
      }
    })
    let div = document.createElement('div')
    let el = document.body.appendChild(div)
    Vue.prototype.$toast = new Toast().$mount(el)
  }
}

