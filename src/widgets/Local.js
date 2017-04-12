import Vue from 'vue'
const local = process.env.NODE_ENV !== 'production'
Vue.prototype.local = local
