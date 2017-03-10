export default {
  saveInit: ({ commit }, payload) => {
    commit('saveInit', payload)
  },
  saveAssured: ({ commit }, payload) => {
    commit('saveAssured', payload)
  },
  saveMatters: ({ commit }, payload) => {
    commit('saveMatters', payload)
  },
  saveSafegoods: ({ commit }, payload) => {
    commit('saveSafegoods', payload)
  },
  setApplicant: ({ commit }, payload) => {
    commit('setApplicant', payload)
  },
  setAntiMoney: ({ commit }, payload) => {
    commit('setAntiMoney', payload)
  }
}

