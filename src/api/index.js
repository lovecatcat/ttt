import axios from 'axios'
/**
 * env 环境变量
 * 开发环境: development
 * 生产环境: production
 * @type {String}
 */
// 保险公司ID
const SCID = 12

let env = 'prod'
let url = 'https://www.luckyins.com/api/api/invoke'
if (location.port === '8080') {
  env = 'local'
  url = '/api/api/api/invoke'
} else if (/^ts-/.test(location.host)) {
  env = 'test'
  url = '//ts-www.luckyins.com/api/api/invoke'
}
let urlData = '?device=mobile&view=true&'
axios.defaults.baseURL = env.url
// let getUrl = env.url
// const env = location.port === '8080' ? 'development' : 'production'
// axios.defaults.baseURL = env === 'development' ? '/api' : '//' + location.host
// axios.defaults.baseURL = env === 'development' ? '//ts-cloud.ehuimeng.com' : '//' + location.host

//登录
// const login = function (cb) {
//   axios.get('/api/api/login?channel_id=2&type=account&data={"keyword":"15768397348","password":"Zjj871026"}').then(res => {
//     console.log('登录成功')
//   }).catch(error => {
//     cb(error)
//     console.log(error)
//   })
// }

//整理下拉框需要的数据
function dataToselect(data, type) {
  var arr = []
  if (!data) {
    return false
  }
  data.forEach(function (ite, ind) {
    arr.push({
      text: type ? ite.name : ite.enum_name,
      value: ite.id
    })
  })
  return arr
}
//获取初始化信泰数据
const initField = function (cb) {
  axios.get(url + urlData + 'server=PolicyIns.initPolicyField&data={"supplier_id":' + SCID + '}').then(response => {
    var res = {}
    const data = response.data.data
    data.forEach(function (item, index) {
      var itemdata = item.child
      if (item.cate === 'AA') {
        res.ID_type = dataToselect(itemdata) //证件类型
      } else if (item.cate === 'AB') {
        res.gender = dataToselect(item.child) //性别
      } else if (item.cate === 'BK') {
        res.is_assured = dataToselect(item.child) //与投保人关系
      } else if (item.cate === 'AD') {
        res.marriage = dataToselect(item.child) //婚姻状况
      } else if (item.cate === 'AE') {
        res.occupation = dataToselect(item.child) //职业
      } else if (item.cate === 'AF') {
        res.annual_source = dataToselect(item.child)//收入来源
      } else if (item.cate === 'AG') {
        res.social_security = dataToselect(item.child) //是否有社保
      } else if (item.cate === 'AH') {
        res.tax_type = dataToselect(item.child) //税收类型
      } else if (item.cate === 'AI') {
        res.nation = dataToselect(item.child) //国籍
      } else if (item.cate === 'AJ') {
        res.drving_type = dataToselect(item.child) //驾照类型
      } else if (item.cate === 'AL') {
        res.resident_type = dataToselect(item.child) //居民类型
      } else if (item.cate === 'AN') {
        res.relation_beneficiary = dataToselect(item.child) //受益人与被保人关系
      } else if (item.cate === 'AO') {
        res.beneficiary_type = dataToselect(item.child) //受益人类型 法定 指定
      } else if (item.cate === 'AP') {
        res.benefit_type = dataToselect(item.child) //受益类型 身故
      } else if (item.cate === 'AV') {
        res.bank_code = dataToselect(item.child) //银行代码
      } else if (item.cate === 'AU') {
        res.bank_type = dataToselect(item.child) //银行卡类型
      } else if (item.cate === 'AS') {
        res.GetPolMode = dataToselect(item.child) //保单递送方式
      } else if (item.cate === 'area') {
        res.province = dataToselect(item.child, true) //省
      } else if (item.cate === 'BB') {
        res.nj_safe_year = dataToselect(item.child) //年金保障年限
      } else if (item.cate === 'BC') {
        res.nj_get_way = dataToselect(item.child) //年金领取方式
      } else if (item.cate === 'BD') {
        res.nj_get_type = dataToselect(item.child) //年金领取类型
      } else if (item.cate === 'BH') {
        res.DisputedFlag = dataToselect(item.child) //合同处理方式
      } else if (item.cate === 'AT') {
        res.PayMode = dataToselect(item.child) //首期缴费方式
      } else if (item.cate === 'BJ') {
        res.ExPayMode = dataToselect(item.child) //续期缴费方式
      }
    })
    cb(res)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}

//获取市区
const GetArea = function (id, cb) {
  axios.get(url + urlData + 'server=PolicyIns.getArea&data={"id":' + id + '}')
    .then(response => {
      var citys_data = []
      const data = response.data.data
      if (!data) {
        return false
      }
      data.forEach(function (item, index) {
        citys_data.push({
          text: item.name,
          value: item.id,
          zipCode: item.zip_code
        })
      })
      cb(citys_data)
    })
    .catch(error => {
      cb(error)
      console.log(error)
    })
}

//获取职业
const queryOccupation = function (value, cb) {
  axios.get(url + urlData + 'server=PolicyIns.getBasicEnumCode&data={"id":"' + value + '"}').then(response => {
    cb(response.data.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}
//搜索职业
const searchOccupation = function (key, cb) {
  axios.get(url + urlData + 'server=PolicyIns.searchJob&data={"supplier_id":' + SCID + ',"name":"' + key + '"}').then(response => {
    cb(response.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}
//获取职业代码
const getJobPid = function (key, cb) {
  axios.get(url + urlData + 'server=PolicyIns.getJobPid&data={"id":"' + key + '"}').then(response => {
    cb(response.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}
//获取险种
const querySafegoods = function (data, cb) {
  axios.get(url + urlData + 'server=PolicyIns.getProductList&data={"supplier_id":' + SCID + ',"user_id":' + data + '}').then(response => {
    cb(response.data.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}

//计算保费
const calMoney = function (data, cb) {
  axios.get(url + urlData + 'server=PolicyIns.onlineInsured&data=' + data).then(response => {
    cb(response.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}

//健康告知
const queryMatters = function (cb) {
  axios.get(url + urlData + 'server=PolicyIns.getMatterList&data={"supplier_id":"12","version":"2"}').then(response => {
    cb(response.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}

//双主险
const getDoubleOrderid = function (cb) {
  axios.get(url + urlData + 'server=PolicyIns.onlineInsured&data={"msg":{"policy_id":""},"company_code":"XinTai","method":"getPolicyNo"}').then(response => {
    cb(response.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}

//保存保单
const saveWarranty = function (data, cb) {
  axios.post(url + urlData + 'server=PolicyIns.save&data=' + data).then(response => {
    cb(response.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}
// 核保
const pushWarranty = function (data, cb) {
  axios.post(url + urlData + 'server=PolicyIns.onlineInsured&data={"msg":{"policy_id":"' + data + '"},"company_code":"XinTai","method":"insure"}').then(response => {
    cb(response.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}
//删除数据
const deleteItem = function (war_id, itemId, type, cb) {
  axios.post(url + urlData + 'server=PolicyIns.deleteInsInfo&data={"table":"' + type + '","id":"' + itemId + '","policy_id":' + war_id + '}').then(response => {
    cb(response.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}

//人核支付
const paySuccess = function (data, cb) {
  axios.post(url + urlData + 'server=PolicyIns.onlineInsured&data={"msg":{"policy_id":"' + data + '"},"company_code":"XinTai","method":"paySuccess"}').then(response => {
    cb(response.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}
//自核支付
const payInterface = function (data, cb) {
  axios.post(url + urlData + 'server=PolicyIns.onlineInsured&data={"msg":{"policy_id":"' + data + '"},"company_code":"XinTai","method":"payInterface"}').then(response => {
    cb(response.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}
//上传影像
const insuredImg = function (data, cb) {
  axios.post(url + urlData + 'server=PolicyIns.onlineInsured&data={"msg":{"policy_id":"' + data + '"},"company_code":"XinTai","method":"insuredImg"}').then(response => {
    cb(response.data)
  }).catch(error => {
    cb(error)
    console.log(error)
  })
}

const queryID = function (id, tb, cb) {
  axios.get('Warranty/findApplOrAssu?table_name=' + tb + '&document_number=' + id + '&t=' + new Date().getTime())
    .then(response => {
      let res = response.data.data
      cb(res)
    })
    .catch(error => {
      cb(error)
      console.log(error)
    })
}

const getAge = function(str) {
  if (!str) return
  var now = new Date()
  var year = now.getFullYear()
  var month = now.getMonth() + 1
  var day = now.getDate()

  var r = str.split('-').map(item => parseInt(item))
  var age = year - r[0]
  if (r[1] > month || (r[1] === month && r[2] > day)) { // 当月
    age -= 1
  }
  return age
}

const obj2json = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// const share = function(data, cb) {
//   axios.post('wechat/share', data).then(response => {
//     cb(response.data)
//   }).catch(error => {
//     cb(error)
//     console.log(error)
//   })
// }

// 保存临时数据
const keepData = function (data, cb) {
  axios.post('/Home/Warranty/tmpSave', data)
    .then(response => {
      cb(response.data)
    })
    .catch(error => {
      cb(error)
    })
}

//获取临时数据列表
const getData = function (admin_id, cb) {
  axios.get('/Home/Warranty/tmpSaveList?admin_id=' + admin_id)
    .then(response => {
      cb(response.data)
    })
    .catch(error => {
      cb(error)
    })
}

//删除临时数据
const deleteData = function (admin_id, cb) {
  axios.get('/Home/Warranty/tmpSaveDelete?admin_id=' + admin_id)
    .then(response => {
      cb(response.data)
    })
    .catch(error => {
      cb(error)
    })
}

export default {
  // login,
  initField,
  queryID,
  GetArea,
  searchOccupation,
  queryOccupation,
  getJobPid,
  queryMatters,
  querySafegoods,
  pushWarranty,
  getDoubleOrderid,
  getAge,
  obj2json,
  // share,
  getData,
  deleteData,
  keepData,
  calMoney,
  saveWarranty,
  deleteItem,
  paySuccess,
  payInterface,
  insuredImg
}

