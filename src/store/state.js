import $_GET from '../widgets/Get.js'
// import local from '../widgets/Local'

let user_id = $_GET['user_id']
// if (!user_id && !local) {
//   location.href = '/Wechat/login'
// }

export default {
  warranty: {}, //保单信息
  applicant: {}, //投保人信息
  assured: {}, //被保人信息
  bank: {}, //交费信息
  insured: 0, //核保结果
  uploadImg: '', //上传影像结果
  anti_money: false, //反洗钱标准
  init: {}, //初始化数据,
  insurances: {}, //选中的险种
  user_id: user_id || 2684,
  todo: false, //未完成订单
  ready: false, //首页加载
  war_id: null, //保单ID
  tmp: { //受益人
    people: [0],
    current: 0
  },
  addr: { // 地址
    11: {
      text: '北京',
      value: 1
    },
    12: {
      text: '天津',
      value: 2
    },
    13: {
      text: '河北',
      value: 5
    },
    14: {
      text: '山西',
      value: 6
    },
    15: {
      text: '内蒙古',
      value: 7
    },
    21: {
      text: '辽宁',
      value: 8
    },
    22: {
      text: '吉林',
      value: 9
    },
    23: {
      text: '黑龙江',
      value: 10
    },
    31: {
      text: '上海',
      value: 3
    },
    32: {
      text: '江苏',
      value: 11
    },
    33: {
      text: '浙江',
      value: 12
    },
    34: {
      text: '安徽',
      value: 13
    },
    35: {
      text: '福建',
      value: 14
    },
    36: {
      text: '江西',
      value: 15
    },
    37: {
      text: '山东',
      value: 16
    },
    41: {
      text: '河南',
      value: 17
    },
    42: {
      text: '湖北',
      value: 18
    },
    43: {
      text: '湖南',
      value: 19
    },
    44: {
      text: '广东',
      value: 20
    },
    45: {
      text: '广西',
      value: 21
    },
    46: {
      text: '海南',
      value: 22
    },
    50: {
      text: '重庆',
      value: 4
    },
    51: {
      text: '四川',
      value: 23
    },
    52: {
      text: '贵州',
      value: 24
    },
    53: {
      text: '云南',
      value: 25
    },
    54: {
      text: '西藏',
      value: 26
    },
    61: {
      text: '陕西',
      value: 27
    },
    62: {
      text: '甘肃',
      value: 28
    },
    63: {
      text: '青海',
      value: 29
    },
    64: {
      text: '宁夏',
      value: 30
    },
    65: {
      text: '新疆',
      value: 31
    },
    71: {
      text: '台湾',
      value: 32
    },
    81: {
      text: ' 香港',
      value: 33
    },
    82: {
      text: '澳门',
      value: 34
    },
    90: {
      text: '钓鱼岛',
      value: 35
    }
  },
  districts: {},
  cities: {}
}
