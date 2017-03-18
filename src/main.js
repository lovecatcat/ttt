
'use strict'
/*const FastClick = require('fastclick')
FastClick.attach(document.body)*/

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

import './assets/iconfont/app-iconfont.css'
import './assets/css/app.scss'

// 滚动顶部
Vue.mixin({
  activated() {
    scrollTo(0, 0)
  }
})

Vue.config.productionTip = false

/* eslint-disable */
var app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
