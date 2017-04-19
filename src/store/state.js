var admin_id = document.getElementById('id').value
admin_id = admin_id === '{$admin_id}' || admin_id === '' ? '911' : admin_id
export default {
  warranty: {}, //保单信息
  applicant: {}, //投保人信息
  assured: {}, //被保人信息
  status: 0, //保单状态
  tid: '', //投保单号
  anti_money: false, //反洗钱标准
  init: {}, //初始化数据,
  main_insurance: '0', //主险数据
  admin_id: admin_id,
  todo: false, //未完成订单
  ready: false, //首页加载
  tmp: { //受益人
    people: [0],
    current: 0
  },
  addr: { // 地址
    11: {
      name: '北京',
      if_id: 129
    },
    12: {
      name: '天津',
      if_id: 147
    },
    13: {
      name: '河北',
      if_id: 165
    },
    14: {
      name: '山西',
      if_id: 348
    },
    15: {
      name: '内蒙古',
      if_id: 479
    },
    21: {
      name: '辽宁',
      if_id: 594
    },
    22: {
      name: '吉林',
      if_id: 713
    },
    23: {
      name: '黑龙江',
      if_id: 783
    },
    31: {
      name: '上海',
      if_id: 929
    },
    32: {
      name: '江苏',
      if_id: 948
    },
    33: {
      name: '浙江',
      if_id: 1061
    },
    34: {
      name: '安徽',
      if_id: 1174
    },
    35: {
      name: '福建',
      if_id: 1296
    },
    36: {
      name: '江西',
      if_id: 1391
    },
    37: {
      name: '山东',
      if_id: 1503
    },
    41: {
      name: '河南',
      if_id: 1660
    },
    42: {
      name: '湖北',
      if_id: 1837
    },
    43: {
      name: '湖南',
      if_id: 1955
    },
    44: {
      name: '广东',
      if_id: 2092
    },
    45: {
      name: '广西',
      if_id: 2290
    },
    46: {
      name: '海南',
      if_id: 2419
    },
    50: {
      name: '重庆',
      if_id: 2451
    },
    51: {
      name: '四川',
      if_id: 2495
    },
    52: {
      name: '贵州',
      if_id: 2700
    },
    53: {
      name: '云南',
      if_id: 2798
    },
    54: {
      name: '西藏',
      if_id: 2944
    },
    61: {
      name: '陕西',
      if_id: 3026
    },
    62: {
      name: '甘肃',
      if_id: 3150
    },
    63: {
      name: '青海',
      if_id: 3254
    },
    64: {
      name: '宁夏',
      if_id: 3306
    },
    65: {
      name: '新疆',
      if_id: 3334
    },
    71: {
      name: '台湾',
      if_id: 3453
    },
    81: {
      name: ' 香港',
      if_id: 3844
    },
    82: {
      name: '澳门',
      if_id: 3866
    },
    90: {
      name: '钓鱼岛',
      if_id: 3877
    }
  },
  districts: {},
  cities: {}
}
