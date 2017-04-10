
'use strict'
/*const FastClick = require('fastclick')
FastClick.attach(document.body)*/

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// components
import './widgets'

// // Alert
// import Alert from './widgets/Alert'
// Vue.use(Alert)

// Toast
import Toast from './widgets/Toast'
Vue.use(Toast)

// Dialog
import Dialog from './widgets/Dialog'
Vue.use(Dialog)

// Preview
import Preview from './widgets/preview'
Vue.use(Preview)

Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

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
  components: { App}
})
