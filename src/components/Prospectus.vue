<template>
  <div id="Prospectus">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header"><span class="app-iconfont">&#xe631;</span>选择险种信息</div>
      <div class="am-list-body">
        <app-select label="险种">
          <select v-model="main_insurance" @change="insurance_changed">
            <option disabled value="0">请选择</option>
            <option v-if="item.safe_id == 209 || item.safe_id == 210" v-for="item in safegoods" :value="item">{{item.name}}</option>
          </select>
        </app-select>
        <app-select label="交费期间">
          <input v-if="!attr" disabled v-model="insurance.pay_year" type="text" placeholder="请填写缴费期间">
          <select v-model="insurance.pay_year" v-else @change="insurance.period_money = ''">
            <option disabled value="0">请选择</option>
            <option v-for="item in attr" :value="item.sv_id">{{item.pay_year == 1 ? '趸交' : item.pay_year + '年'}}</option>
          </select>
        </app-select>
        <app-select label="保险期间">
          <input v-if="!attr2" disabled v-model="insurance.safe_year" type="text" placeholder="请填写保险期间">
          <select v-else v-model="insurance.safe_year" @change="insurance.period_money = ''" :disabled="attr2.length === 1">
            <option v-if="attr2.length > 1" disabled>请选择</option>
            <option v-for="item in attr2" :value="item.sv_id">{{item.safe_year==999?'终身':item.safe_year}}</option>
          </select>
        </app-select>
        <app-input label="基本保险金额">
          <input slot="input" @change="insurance.period_money = ''" v-model.number.lazy="insurance.money" type="number" placeholder="请填写基本保险金额（元）" @blur="checkMoney()">
          <div slot="icon" v-show="insurance.money != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="insurance.money = ''"></i></div>
        </app-input>
        <app-input label="期交保费">
          <input slot="input" readonly v-model.number="insurance.period_money" type="number" placeholder="期交保费(元)">
          <div slot="button" class="am-list-button" @click="cal">
            <button type="button">点击计算</button>
          </div>
        </app-input>
        <app-select label="保单选项">
          <select v-model="warranty.delivery_way" v-if="init.warranty">
            <option v-for="item in init.warranty.delivery_way" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="邮箱" v-show="warranty.delivery_way === '117'">
          <input slot="input" @change="checkEmail" v-model.lazy="applicant.email" type="email" placeholder="请填写邮箱">
          <div slot="icon" v-show="applicant.email != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.email = ''"></i></div>
        </app-input>
      </div>
      <div class="am-list-footer" v-if="warranty.delivery_way === '117'">
        仅发送电子保单到投保人邮箱里
      </div>
      <div class="am-list-footer" v-else>
        仅打印纸质保单（包含回执），不发送电子保单
      </div>
    </div>
    <div class="am-list">
      <div class="am-list-body">
        <div class="am-list-item">
          <div class="am-list-label">您是否已参加当地社会基本医疗保险（或公费医疗）？</div>
          <div class="am-list-control">
            <div class="am-switch" v-if="init.assured">
              <input type="checkbox" v-model="warranty.assu_social_security" v-bind:true-value="init.assured.social_security[0].if_id" v-bind:false-value="init.assured.social_security[1].if_id" class="am-switch-checkbox">
              <label class="am-switch-label">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="am-tab am-fixed am-fixed-bottom app-navi">
      <router-link :to="back" class="am-tab-item">上一步</router-link>
      <router-link to="/beneficiaries" class="am-tab-item selected">下一步</router-link>
    </div>
  </div>
</template>
<script>
// import Insurance from './Insurance'
const qs = require('qs')
import Api from '../api'

// 根据key去重
const unique = function(a, key) {
  var res = []
  for (var i = 0, len = a.length; i < len; i++) {
    for (var j = i + 1; j < len; j++) {
      if (key && a[i][key] === a[j][key]) {
        j = ++i
      } else {
        j = ++i
      }
    }
    res.push(a[i])
  }
  return res
}

// 计算周岁
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

export default {
  name: 'prospectus',
  data() {
    return {
      back: '/beinsured',
      uploading: false,
      insurance: {
        safe_id: '', //险种
        safe_year: '', //保险期间
        pay_year: '', //交费年期
        money: '', //基本保险金额
        period_money: '' //期交保费
      },
      warranty: {
        delivery_way: '117',
        assu_social_security: '15047'
      },
      applicant: {
        email: '' //邮箱
      },
      // pay_year: null, //交费年期
      // safe_year: null, //保险期间
      attr: null, //保险属性
      attr2: null, //保险属性

      safegoods: [] //保险产品

    }
  },
  computed: {
    main_insurance: {
      get() {
        return this.$store.state.main_insurance
      },
      set(val) {
        this.$store.commit('setParam', {
          main_insurance: val
        })
      }
    },
    init() {
      return this.$store.state.init || {}
    }
  },
  watch: {
    insurance: {
      handler(val) {
        this.save2local('insurance', val)
      },
      deep: true
    },
    main_insurance: {
      handler(val) {
        this.save2local('main_insurance', val)
      },
      deep: true
    }
  },
  created() {
    var vm = this
    Api.querySafegoods(res => {
      if (res.name && res.name.indexOf('Error') > -1) {
        vm.$toast.open('服务器开小差了', 'error')
        return
      }
      vm.safegoods = res
      vm.$store.commit('saveSafegoods', res)
      if (vm.$store.state.todo && vm.$storage.fetch('main_insurance').safe_id) {
        vm.setData('main_insurance', vm.$storage.fetch('main_insurance'))
        vm.$nextTick(function() {
          vm.attr = vm.main_insurance.attr
          vm.attr2 = unique(vm.attr, 'safe_year')
          var insurance = vm.$storage.fetch('insurance')
          this.insurance.safe_id = insurance.safe_id
          this.insurance.money = insurance.money
          this.insurance.pay_year = insurance.pay_year
          if (vm.attr2.length === 1) {
            this.insurance.safe_year = vm.attr2[0].sv_id
          }
        })
      }
      this.$nextTick(() => {
        this.insurance = Object.assign({}, this.insurance, {
          money: 50000
        })
        this.applicant.email = 'sdff@fsdfd.ss'
      })
    })
  },
  activated() {
    if (this.$store.state.warranty.is_assured === 15000) {
      this.back = '/insured'
    } else {
      this.back = '/beinsured'
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/insured' || to.path === '/beinsured') {
      this.insurance.period_money = ''
      next()
      return
    }
    if (!this.checkForm()) return
    if (!this.insurance.period_money) {
      this.$toast.open('请点击计算期交保费', 'warn')
      return
    }
    if (this.warranty.delivery_way === '117' && !this.checkEmail()) {
      return false
    }
    this.$store.commit('saveAssured', this.assured)
    this.$store.commit('setWarranty', this.warranty)
    this.$store.commit('setApplicant', this.applicant)
    this.$store.commit('saveInsurance', Api.obj2json([this.insurance]))
    next()
  },
  methods: {
    cal() {
      var vm = this
      if (!vm.checkForm() || vm.uploading) {
        return
      }
      vm.uploading = true
      setTimeout(() => {
        vm.uploading = false
      }, 1500)
      vm.$toast.open('正在计算', 'loading')

      let pushData = {}
      let filter = ['register_select', 'address_select', 'occupation_select', 'contains', 'getArrayIndex', 'bank_label', 'ChCity', 'ChDistrict', 'ChPro', 'oid', 'pid', 'bank_address']
      let applicant = Object.assign({}, vm.applicant, vm.$store.state.applicant)
      for (var i in applicant) {
        var index = 'applicant_' + i
        if (filter.indexOf(i) > -1) {
          continue
        }
        pushData[index] = applicant[i]
      }
      let assured = vm.$store.state.assured
      for (var j in assured) {
        var open = 'assured_' + j
        if (j === 'appl_id') continue
        if (filter.indexOf(j) > -1) {
          continue
        }
        pushData[open] = assured[j]
      }

      let warranty = Object.assign({}, vm.warranty, vm.$store.state.warranty)
      for (var k in warranty) {
        if (filter.indexOf(k) > -1) continue
        var p = 'warranty_' + k
        pushData[p] = warranty[k]
      }
      pushData['warranty_admin_id'] = vm.$store.state.admin_id
      pushData['warranty_sc_id'] = 19
      pushData['warranty_is_save'] = 0
      pushData['warranty_source'] = 2

      pushData['insurance_war_id'] = []
      pushData['insurance_money'] = []
      pushData['insurance_pay_year'] = []
      pushData['insurance_safe_id'] = []
      pushData['insurance_safe_year'] = []

      let insurances = [vm.insurance]
      insurances.forEach(function(insurance) {
        pushData['insurance_war_id'].push('')
        pushData['insurance_money'].push(insurance.money)
        pushData['insurance_pay_year'].push(insurance.pay_year)
        pushData['insurance_safe_id'].push(insurance.safe_id)
        pushData['insurance_safe_year'].push(insurance.safe_year)
      })

      // console.log(pushData)
      Api.pushWarranty(qs.stringify(pushData), res => {
        if (res.name && res.name.indexOf('Error') > -1) {
          vm.$toast.open('服务器开小差了', 'error')
          return
        }
        if (res.status === '0') {
          console.info(res.message)
          vm.$toast.open('计算失败：' + res.message)
          return
        } else {
          vm.$toast.close()
          vm.insurance.period_money = res.data[vm.insurance.safe_id]
          vm.$store.dispatch('saveAssured', {
            'assu_id': res.id.assured_assu_id
          })
          vm.$store.dispatch('setApplicant', {
            'appl_id': res.id.applicant_appl_id
          })
          let pay_year
          vm.attr.forEach(item => {
            if (item.sv_id === vm.insurance.pay_year) {
              pay_year = item.pay_year
            }
          })

          // 是否达到反洗钱标准
          vm.$store.dispatch('setAntiMoney', (res.data[vm.insurance.safe_id] * pay_year >= 200000))
        }
      })
    },
    insurance_changed() {
      const vm = this
      vm.insurance.safe_id = vm.main_insurance.safe_id
      vm.attr = vm.main_insurance.attr
      vm.attr2 = unique(vm.attr, 'safe_year')

      // 初始化值
      vm.add_insurances = null
      vm.insurance.pay_year = 0
      if (vm.attr2.length === 1) {
        vm.insurance.safe_year = vm.attr2[0].sv_id
      } else {
        vm.insurance.safe_year = null
      }
      vm.checkAge()
    },
    checkEmail() {
      const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      const vm = this
      var toast_text = null
      if (!vm.applicant.email) {
        toast_text = '邮箱不能为空'
      } else if (!reg.test(vm.applicant.email)) {
        toast_text = '请输入正确格式的邮箱'
      }
      if (toast_text) {
        this.$toast.open(toast_text, 'warn')
        return false
      }
      return true
    },
    checkMoney() {
      var id = this.main_insurance.safe_id
      var money = parseInt(this.insurance.money)
      var toast_text = null
      switch (id) {
        case '209':
          if (money < 50000 || money % 10000 !== 0) {
            toast_text = '最低保额为50000元，且为1万元整数倍'
          }
          break
        case '210':
          if (money < 300000 || money % 10000 !== 0) {
            toast_text = '最低保额为30万元，且为1万元整数倍'
          }
          break
      }
      if (toast_text) {
        this.$toast.open(toast_text, 'warn')
        return false
      }
      return true
    },
    checkAge() {
      var vm = this
      var age = getAge(vm.$store.state.assured.birthday)
      var id = this.main_insurance.safe_id
      if (age > 60 && id === '209') {
        vm.$toast.open('被保险人年龄不能大于60周岁', '')
        return false
      } else if (age > 50 && id === '210') {
        vm.$toast.open('被保险人年龄不能大于50周岁', '')
        return false
      }
      return true
    },
    checkForm() {
      const vm = this
      var toast_text = null
      if (!vm.insurance.safe_id) {
        toast_text = '请选择险种'
      } else if (!vm.insurance.safe_year) {
        toast_text = '请选择保险期间'
      } else if (!vm.insurance.pay_year) {
        toast_text = '请选择交费年期'
      } else if (!vm.insurance.money) {
        toast_text = '请填写基本保险金额'
      }
      if (toast_text) {
        this.$toast.open(toast_text, 'warn')
        return false
      }
      return this.checkMoney() && this.checkAge()
    }
  }
}
</script>
