/**
 * env 环境变量
 * 开发环境: development
 * 生产环境: production
 * @type {String}
 */
const env = location.port == '80801' ? 'development' : 'production'
  // 保险公司ID
const SCID = 19

// http数据交互插件
import axios from 'axios'
axios.defaults.baseURL = env == 'development' ? 'http://172.16.2.70/hmhome/' : 'http://cloud.ehuimeng.com/'

const initField = function (cb) {
  axios.get('Warranty/initWarField?sc_id=' + SCID).then(response => {
    var res = {}
    const data = response.data
    data.forEach(function (item, index) {
      if (item.name == 'warranty') {
        // 保单信息
        res.warranty = {}
        item.list.forEach(function (citem) {
          if (citem.a_id == 53) { //与投保人关系
            res.warranty.is_assured = citem.children
          } else if (citem.a_id == 30) { //合同争议处理方式
            res.warranty.contract_handle = citem.children
          } else if (citem.a_id == 33) { //保单递送方式
            res.warranty.delivery_way = citem.children
          }
        })
      } else if (item.name == 'applicant') {
        // 投保人信息
        res.applicant = {}
        item.list.forEach(function (citem) {
          if (citem.a_id == 6) { //省
            res.applicant.province = citem.children
          } else if (citem.a_id == 16) { //国籍
            res.applicant.nationality = citem.children
          } else if (citem.a_id == 14) { //证件类型
            res.applicant.document_type = citem.children
          } else if (citem.a_id == 13) { //性别
            res.applicant.sex = citem.children
          } else if (citem.a_id == 10) { //职业代码
            res.applicant.occupation_code = citem.children
          }
        })
      } else if (item.name == 'assured') {
        // 被保险人信息
        res.assured = {}
        item.list.forEach(function (citem) {
          if (citem.a_id == 6) { //省
            res.assured.province = citem.children
          } else if (citem.a_id == 16) { //国籍
            res.assured.nationality = citem.children
          } else if (citem.a_id == 14) { //证件类型
            res.assured.document_type = citem.children
          } else if (citem.a_id == 13) { //性别
            res.assured.sex = citem.children
          } else if (citem.a_id == 10) { //职业代码
            res.assured.occupation_code = citem.children
              // } else if (citem.a_id == 46) { //社保（含新农合）
              //   res.assured.social_security = citem.children
          }
        })
      } else if (item.name == 'beneficiary') {
        // 受益人信息
        res.beneficiary = {}
        item.list.forEach(citem => {
          if (citem.a_id == 66) {
            res.beneficiary.relationship = citem.children
          }
        })
      } else if (item.name == 'transferstate') {
        // 银行信息
        res.transferstate = {}
        item.list.forEach(citem => {
          if (citem.a_id == 5) {
            res.transferstate.bank_name = citem.children
          } else if (citem.a_id == 9) {
            res.transferstate.bank_card = citem.children
          }
        })
      }
    })
    cb(res)
  }).catch(error => {
    console.log(error)
  })
}

const queryID = function (id, tb, cb) {
  axios.get('Warranty/findApplOrAssu?table_name=' + tb + '&document_number=' + id).then(response => {
    var res = response.data.data
    if (!res.appl_id && !res.assu_id) {
      res = false
    }
    cb(res)
  }).catch(error => {
    console.log(error)
  })
}

const queryRegion = function (mode, code, cb) {
  axios.get('Warranty/getAreaList?mode=' + mode + '&code=' + code).then(response => {
    cb(response.data)
  }).catch(error => {
    console.log(error)
  })
}

const searchOccupation = function (key, cb) {
  axios.get('UploadWarranty/getOccupation?search=' + key).then(response => {
    cb(response.data)
  }).catch(error => {
    console.log(error)
  })
}

const queryOccupation = function (if_id, cb) {
  axios.get('Warranty/getSubFieldList?if_id=' + if_id).then(response => {
    cb(response.data)
  }).catch(error => {
    console.log(error)
  })
}

const queryMatters = function (cb) {
  axios.get('Warranty/getClientmatterList?sc_id=' + SCID).then(response => {
    cb(response.data)
  }).catch(error => {
    console.log(error)
  })
}

const querySafegoods = function (cb) {
  axios.get('Warranty/getSafegoodsList?sc_id=' + SCID).then(response => {
    cb(response.data)
  }).catch(error => {
    console.log(error)
  })
}

const pushWarranty = function (data, cb) {
  axios.post('Warranty/pushWarranty', data).then(response => {
    cb(response.data)
  }).catch(error => {
    console.log(error)
  })
}

const queryZipcode = function (code, cb) {
  axios.get('Warranty/getZipCode?code=' + code).then(response => {
    cb(response.data)
  }).catch(error => {
    console.log(error)
  })
}

export default {
  initField,
  queryID,
  queryRegion,
  searchOccupation,
  queryOccupation,
  queryMatters,
  querySafegoods,
  pushWarranty,
  queryZipcode
}

