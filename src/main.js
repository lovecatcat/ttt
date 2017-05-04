'use strict'
/*const FastClick = require('fastclick')
FastClick.attach(document.body)*/

import './assets/css/app.scss'
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
Vue.mixin({
  created() {
    // 禁止从中间页进入
    let path = this.$route.fullPath
    let whiteList = ['/', '/confirmation', '/tips', '/insured']
    if (!this.local && !this.$store.state.ready && whiteList.indexOf(path) === -1) {
      window.location.href = '/Wechat/XT_ins'
    }
    // 完成未完成订单
    if (this.$store.state.todo) {
      this.setData('applicant', this.$storage.fetch('applicant'))
      this.setData('assured', this.$storage.fetch('assured'))
      this.setData('warranty', this.$storage.fetch('warranty'))
    }
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
    save2local(key, val) {
      // this.local && console.log('存储到缓存' + key, JSON.stringify(val))
      // this.$storage.save(key, Object.assign(this.$storage.fetch(key), val))
    },
    setData(key, val) {
      // if (!this[key]) return
      // this.local && console.log('从缓存读取' + key, JSON.stringify(val))
      // this[key] = typeof this[key] === 'object' ? Object.assign({}, this[key], val) : Object.assign({}, val)
    },
    clearStorage() {
      this.$storage.remove('applicant')
      this.$storage.remove('assured')
      this.$storage.remove('warranty')
      this.$storage.remove('main_insurance')
      this.$storage.remove('insurance')
      this.$storage.remove('clientvalue')
      this.$storage.remove('init')
    }
  }
})

Vue.config.productionTip = false
import Wechat from './widgets/Wechat'
import $_GET from './widgets/Get'
import qs from 'qs'

/* eslint-disable */
var app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created(){
    if($_GET['shared']){
      this.$router.push('/insured')
    }
    var params = {
      admin_id: $_GET['admin_id'],
      shared: true
    }
    Wechat.share({
      title: '信泰人寿在线投保',
      desc: '\r\n【汇盟保险，更专业的保险管家】',
      link: 'http://cloud.ehuimeng.com/Wechat/XT_ins2c?' + qs.stringify(params), // 分享链接
      imgUrl: location.protocol + '//' + location.host + '/Theme/index/home/images/logo.png' // 分享图标
    })
  }
})
