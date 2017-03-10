import Api from '../api'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import state from './state'
import mutations from './mutations'
import actions from './actions'

// const actions = {}
const getters = {
  init: state => {
    state.init || Api.initField(res => {
      state.init = res
      return res
    })
  }
}
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  state,
  getters,
  mutations,
  actions
})

