export default {
  setUserId(state, payload) {
    state.user_id = payload
  },
  saveInit(state, payload) {
    state.init = Object.assign({}, state.init, payload)
  },
  setWarranty(state, payload) {
    state.warranty = Object.assign({}, state.warranty, payload)
  },
  setApplicant(state, payload) {
    state.applicant = Object.assign({}, state.applicant, payload)
  },
  saveAssured(state, payload) {
    state.assured = Object.assign({}, state.assured, payload)
  },
  saveBank(state, payload) {
    state.bank = Object.assign({}, state.bank, payload)
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
    console.log(val, index, state.beneficiaries)
    state.beneficiaries && state.beneficiaries.splice(val, 1)
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
  setAntiMoney(state, bool) {
    state.anti_money = bool
  },
  setWarId(state, payload) {
    state.war_id = payload
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

