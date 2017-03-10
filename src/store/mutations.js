const decode = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}
export default {
  saveInit(state, payload) {
      state.init = decode(payload)
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
      // state.assured = payload
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
    },
    saveBeneficiary(state, payload) {
      state.beneficiaries = decode(payload)
    },
    saveClientValue(state, payload) {
      state.clientvalue = decode(payload)
    },
    saveInsurance(state, payload) {
      state.insurances = decode(payload)
    },
    saveMatters(state, payload) {
      state.matters = decode(payload)
    },
    saveSafegoods(state, payload) {
      state.safegoods = decode(payload)
    },
    setAntiMoney(state, bool) {
      state.anti_money = bool
    },
    ready(state) {
      state.ready = true
    },
    setResult(state, payload) {
      state.result = decode(payload)
    }
}

