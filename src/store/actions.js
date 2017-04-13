export default {
  saveInit: ({ commit }, payload) => {
    commit('saveInit', payload)
  },
  setWarranty: ({ commit }, payload) => {
    commit('setWarranty', payload)
  },
  saveAssured: ({ commit }, payload) => {
    commit('saveAssured', payload)
  },
  setApplicant: ({ commit }, payload) => {
    commit('setApplicant', payload)
  },
  saveMatters: ({ commit }, payload) => {
    commit('saveMatters', payload)
  },
  saveSafegoods: ({ commit }, payload) => {
    commit('saveSafegoods', payload)
  },
  setAntiMoney: ({ commit }, payload) => {
    commit('setAntiMoney', payload)
  },
  setParam: ({ commit }, payload) => {
    commit('setParam', payload)
  }
}

