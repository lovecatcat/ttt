export default {
  saveInit(state, payload) {
    state.init = Object.assign({}, state.init, payload)
  },
  setWarranty(state, payload) {
    state.warranty = Object.assign({}, state.warranty, payload)
  },
  setApplicant(state, payload) {
    if (payload.assu_id) {
      delete payload.assu_id
    }
    state.applicant = Object.assign({}, state.applicant, payload)
  },
  saveAssured(state, payload) {
    if (payload.appl_id) {
      delete payload.appl_id
    }
    state.assured = Object.assign({}, state.assured, payload)
  },
  // 添加受益人
  addBeneficiary(state) {
    var poeple = state.tmp.people
    state.tmp.people.push(Math.max(...poeple) + 1)
    state.tmp.current = poeple.length - 1
  },
  // 删除受益人
  delBeneficiary(state, val) {
    let index = state.tmp.people.indexOf(val)
    state.tmp.people.splice(index, 1)
    state.beneficiaries && state.beneficiaries.splice(index, 1)
  },
  saveBeneficiary(state, payload) {
    state.beneficiaries = payload
  },
  saveClientValue(state, payload) {
    state.clientvalue = payload
  },
  saveInsurance(state, payload) {
    state.insurances = payload
  },
  saveMatters(state, payload) {
    state.matters = payload
  },
  saveSafegoods(state, payload) {
    state.safegoods = payload
  },
  setAntiMoney(state, bool) {
    state.anti_money = bool
  },
  setParam(state, payload) {
    if (typeof payload === 'boolean' || typeof payload === 'string') {
      state[index] = payload[index]
    } else {
      for (var index in payload) {
        state[index] = payload[index]
      }
    }
  }
}

