import Vue from 'vue'
import Vuex from 'vuex'
import Api from 'api'
Vue.use(Vuex)

import state from './state'
import mutations from './mutations'
import actions from './actions'

const getters = {
  // initOccupations(state) {
  //   state.init.applicant ? Object.assign({}, state.init.applicant.occupation_code) : {}
  // }
  applAge(state) {
    return Api.getAge(state.applicant.holder_birthday)
  },
  assuAge(state) {
    return Api.getAge(state.assured.insured_birthday)
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

