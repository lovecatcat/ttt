'use strict'
/*const FastClick = require('fastclick')
FastClick.attach(document.body)*/

import './assets/css/antui-all.css'
import './assets/css/app.scss'
import './assets/fonts/iconfont.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// components
import './widgets'

// Toast
import Toast from './widgets/Toast'
Vue.use(Toast)

// Dialog
import Dialog from './widgets/Dialog'
Vue.use(Dialog)

// Preview
import Preview from './widgets/preview'
Vue.use(Preview)

// Storage
import Storage from './widgets/Storage'
Vue.use(Storage)

import local from './widgets/Local'
Vue.prototype.local = local

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

/**
 * 加减天数
 * @param  {int} days: +加, -减
 * @return {date}
 */
Date.prototype.asDays = function (days) {
  this.setDate(this.getDate() + parseInt(days))
  return this
}

Vue.mixin({
  created() {
    // 禁止从中间页进入
    // let path = this.$route.fullPath
    // let whiteList = ['/', '/confirmation', '/tips', '/insured']
    // if (!this.local && !this.$store.state.ready && whiteList.indexOf(path) === -1) {
    //   window.location.href = '/Wechat/toLogin?gourl=XT_ins'
    // }
    // 完成未完成订单
    // if (this.$store.state.todo) {
    //   this.setData('applicant', this.$storage.fetch('applicant'))
    //   this.setData('assured', this.$storage.fetch('assured'))
    // }
  },
  activated() {
    scrollTo(0, 0) // 滚动顶部
  },
  watch: {
    warranty: {
      handler(val) {
        this.save2local('warranty', val)
      },
      deep: true
    },
    applicant: {
      handler(val) {
        this.save2local('applicant', val)
      },
      deep: true
    },
    assured: {
      handler(val) {
        this.save2local('assured', val)
      },
      deep: true
    }
  },
  methods: {
    checkTax(owner, val) {
/*      if (!owner || !val) return
      if (val !== '28') {
        this.$toast.open(owner + '个人税收居民身份类型不是【仅为中国税收居民】时，暂不能在线投保。')
        return false
      }*/
      return true
    },
    checkTerm(owner, term) {
      var toast_text = null
      if (!term || term === '0000-00-00') {
        toast_text = '证件有效期不能为空'
      } else if (/\d{4}(-|\/)\d{2}(-|\/)\d{2}(-|\/)/.test(term)) {
        toast_text = '有效日期格式不正确'
      } else if (new Date(term) - new Date().asDays(-1) < 0) {
        toast_text = '证件已过有效期'
      }
      if (toast_text) {
        this.$toast.open(owner + toast_text, 'warn')
        return false
      }
      return true
    },
    getAge(str) {
      if (!str) return
      var now = new Date()
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      var day = now.getDate()
      var r = str.split('-').map(item => parseInt(item))
      var age = year - r[0]
      if (r[1] > month || (r[1] === month && r[2] > day)) { // 当月
        age -= 1
      }
      return age
    },
    save2local(key, val) {
      this.local && console.log('存储到缓存' + key, JSON.stringify(val))
      this.$storage.save(key, Object.assign(this.$storage.fetch(key), val))
    },
    setData(key, val) {
      if (!this[key]) return
      this.local && console.log('从缓存读取' + key, JSON.stringify(val))
      this[key] = typeof this[key] === 'object' ? Object.assign({}, this[key], val) : Object.assign({}, val)
    },
    clearStorage() {
      this.$storage.remove('applicant')
      this.$storage.remove('assured')
    }
  }
})

Vue.config.productionTip = false
import $_GET from './widgets/Get'

/* eslint-disable */
var app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created() {
    if ($_GET['shared']) {
      this.$router.push('/insured')
    }
  }
})
