<template>
  <div id="Prospectus">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header"><span class="app-iconfont">&#xe631;</span>选择险种信息</div>
      <div class="am-list-body">
        <app-select label="险种" :readonly="safe_id">
          <select v-model="main_insurance" @change="insurance_changed" :disabled="safe_id">
            <option disabled value="0">请选择</option>
            <option v-if="item.safe_id == 209 || item.safe_id == 210 || item.safe_id == 361"
                    v-for="item in safegoods"
                    :value="item">{{item.name}}
            </option>
          </select>
        </app-select>
        <app-select label="交费期间">
          <input v-if="!attr" disabled v-model="insurance.pay_year" type="text" placeholder="请填写缴费期间">
          <select v-model="insurance.pay_year" v-else @change="pyChanged">
            <option disabled value="">请选择</option>
            <option v-for="item in attr" :value="item.sv_id">{{showPayYear(item.pay_year)}}
            </option>
          </select>
        </app-select>
        <app-select label="保险期间" :readonly="attr2 && attr2.length === 1">
          <input v-if="!attr2" disabled v-model="insurance.safe_year" type="text" placeholder="请填写保险期间">
          <select v-else v-model="insurance.safe_year"
                  @change="syChanged"
                  :disabled="attr2.length === 1">
            <option v-if="attr2.length > 1" disabled>请选择</option>
            <option v-for="item in attr2" :value="item.sv_id">{{showSafeYear(item.safe_year)}}</option>
          </select>
        </app-select>
        <app-input label="基本保险金额">
          <input slot="input" @change="insurance.period_money = ''" v-model.number.lazy="insurance.money" type="number"
                 placeholder="请填写基本保险金额（元）" @blur="moneyChanged">
          <div slot="icon" v-show="insurance.money != ''" class="am-list-clear">
            <i class="am-icon-clear am-icon" @click="insurance.money = ''"></i>
          </div>
        </app-input>
        <app-input label="期交保费">
          <input slot="input" readonly v-model.number="insurance.period_money" type="number" placeholder="期交保费(元)">
          <div slot="button" class="am-list-button" @click="cal(false)">
            <button type="button">点击计算</button>
          </div>
        </app-input>
      </div>
    </div>
    <div class="app-list-header">附加险</div>
    <app-dropdown v-if="addonIns[index] && index === '362'"
                  :id="index" :ref="'applicant_'+index"
                  v-for="(item,index) in main_insurance.child"
                  :key="index" up="up" noToggle>
      <template slot="header">
        <div class="am-ft-md"> {{item.name}}</div>
        <div class="am-list-extra" style="min-width:.44rem">投保&nbsp;</div>
        <div class="am-switch">
          <input type="checkbox"
                 @change="chAddonState(index)"
                 v-model="addonsSelected[index]"
                 class="am-switch-checkbox" :id="'addonsSelected_'+index">
          <label class="am-switch-label" :for="'addonsSelected_'+index">
            <div class="am-switch-inner"></div>
            <div class="am-switch-switch"></div>
          </label>
        </div>
      </template>
      <app-select label="交费期间" readonly>
        <select v-model="addonIns[index].pay_year" disabled>
          <option disabled value="">请选择</option>
          <option v-for="pitem in unique(item.attr,'pay_year')"
                  :value="pitem.sv_id" :key="pitem.sv_id"
                  v-text="showPayYear(pitem.pay_year)"></option>
        </select>
      </app-select>
      <app-select label="保险期间" :readonly="item.attr.length===1">
        <select v-model="addonIns[index].safe_year" :disabled="item.attr.length===1">
          <option disabled value="">请选择</option>
          <option v-for="sitem in unique(item.attr, 'safe_year')"
                  :value="sitem.sv_id" :key="sitem.sv_id"
                  v-text="showSafeYear(sitem.safe_year)"></option>
        </select>
      </app-select>
      <app-input label="基本保险金额">
        <input slot="input" readonly v-model.number="addonIns[index].money" type="number" placeholder="与主险保持一致">
      </app-input>
      <app-input label="期交保费">
        <input slot="input" readonly
               v-model.number="addonIns[index].period_money"
               type="number"
               placeholder="请点击计算">
        <div slot="button" class="am-list-button" @click="cal(index)">
          <button type="button">点击计算</button>
        </div>
      </app-input>
    </app-dropdown>
    <div class="am-list am-list-6lb form">
      <div class="am-list-body">
        <app-select label="保单选项">
          <select v-model="warranty.delivery_way" v-if="init.warranty">
            <option v-for="item in init.warranty.delivery_way" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="邮箱" v-show="warranty.delivery_way === '117'">
          <input slot="input" @change="checkEmail" v-model.lazy="applicant.email" type="email" placeholder="请填写邮箱">
          <div slot="icon" v-show="applicant.email != ''" class="am-list-clear">
            <i class="am-icon-clear am-icon" @click="applicant.email = ''"></i>
          </div>
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
              <input type="checkbox" v-model="warranty.assu_social_security"
                     v-bind:true-value="init.assured.social_security[0].if_id"
                     v-bind:false-value="init.assured.social_security[1].if_id" class="am-switch-checkbox">
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
  import $_GET from '../widgets/Get'

  export default {
    name: 'prospectus',
    data () {
      return {
        back: '/beinsured',
        uploading: false,
        safe_id: $_GET['safe_id'] || false,
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
        mainPayYear: '', //主险缴费期间
        mainSafeYear: '', //主险保障期间

        addonsSelected: {}, //附加险投保状态
        safegoods: [] //保险产品
      }
    },
    computed: {
      main_insurance: {
        get () {
          return this.$store.state.main_insurance
        },
        set (val) {
          this.$store.commit('setParam', {
            main_insurance: val
          })
        }
      },
      addonIns: { //附加险信息
        get () {
          return this.$store.state.addonIns
        },
        set (val) {
          this.$store.commit('setParam', {
            addonIns: val
          })
        }
      },
      init () {
        return this.$store.state.init || {}
      }
    },
    watch: {
      insurance: {
        handler (val) {
          this.save2local('insurance', val)
        },
        deep: true
      },
      main_insurance: {
        handler (val) {
          this.save2local('main_insurance', val)
        },
        deep: true
      }
    },
    created () {
      var vm = this
      Api.querySafegoods(res => {
        if (res.name && res.name.indexOf('Error') > -1) {
          vm.$toast.open('服务器开小差了', 'error')
          return
        }
        vm.safegoods = res
        vm.$store.commit('saveSafegoods', res)
        if (this.safe_id) {
          vm.main_insurance = res[this.safe_id]
          vm.insurance_changed()
        }
        if (vm.$store.state.todo && vm.$storage.fetch('main_insurance').safe_id) {
          vm.setData('main_insurance', vm.$storage.fetch('main_insurance'))
          vm.$nextTick(function () {
            vm.attr = this.unique(vm.main_insurance.attr, 'pay_year')
            vm.attr2 = this.unique(vm.main_insurance.attr, 'safe_year')
            var insurance = vm.$storage.fetch('insurance')
            this.insurance.safe_id = insurance.safe_id
            this.insurance.money = insurance.money
            this.insurance.pay_year = insurance.pay_year
            if (vm.attr2.length === 1) {
              this.insurance.safe_year = vm.attr2[0].sv_id
            }
          })
        }
      })
    },
    activated () {
      if (this.$store.state.warranty.is_assured === 15000) {
        this.back = '/insured'
      } else {
        this.back = '/beinsured'
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/insured' || to.path === '/beinsured') {
        this.insurance.period_money = ''
        if (this.addonIns && this.addonIns[362]) {
          this.addonIns[362].period_money = ''
        }
        next()
        return
      }
      if (!this.checkForm()) return
      if (!this.insurance.period_money) {
        this.$toast.open('请点击计算期交保费', 'warn')
        return
      }
      let insurances = [this.insurance]
      for (let i in this.addonsSelected) {
        if (this.addonsSelected[i]) {
          let name = (this.main_insurance.child[i] && this.main_insurance.child[i].name) || ''
          if (!this.checkAddonForm(i)) {
            return false
          }
          if (!this.addonIns[i].period_money) {
            this.$toast.open('请点击计算' + name + '期交保费', 'warn')
            return false
          }
          insurances.push(this.addonIns[i])
        }
      }
      if (this.warranty.delivery_way === '117' && !this.checkEmail()) {
        return false
      }
      this.$store.commit('setWarranty', this.warranty)
      this.$store.commit('setApplicant', this.applicant)
      this.$store.commit('saveInsurance', JSON.parse(JSON.stringify(insurances)))
      next()
    },
    methods: {
      unique (a, key) {
        var res = []
        for (var i = 0, len = a.length; i < len; i++) {
          for (var j = 0, jLen = res.length; j < jLen; j++) {
            if (res[j][key] === a[i][key]) {
              break
            }
          }
          if (j === jLen) {
            res.push(a[i])
          }
        }
        return res
      },
      pyChanged () {
        this.insurance.period_money = ''
        let mainPayYear = null
        this.attr.forEach(item => {
          if (item.sv_id === this.insurance.pay_year) {
            mainPayYear = Number(item.pay_year)
          }
        })
        this.mainPayYear = mainPayYear
        // 百万健康两全保险
        if (!this.main_insurance.child || !this.main_insurance.child[362]) return
        let attr = this.main_insurance.child[362].attr
        this.unique(attr, 'pay_year').forEach(item => {
          if (Number(item.pay_year) === mainPayYear) {
            this.addonIns[362].pay_year = item.sv_id
          }
        })
      },
      syChanged () {
        this.insurance.period_money = ''
        this.attr2.forEach(item => {
          if (item.sv_id === this.insurance.safe_year) {
            this.mainSafeYear = Number(item.safe_year)
          }
        })
      },
      moneyChanged () {
        if (this.addonIns && this.addonIns[362]) {
          this.addonIns[362].period_money = ''
        }
        this.checkMoney()
      },
      showSafeYear (safe_year) {
        if (safe_year === '999') {
          return '终身'
        } else if (Number(safe_year) > 50) {
          return '至' + safe_year + '岁'
        } else {
          return safe_year + '年'
        }
      },
      showPayYear (pay_year) {
        if (pay_year === '1') {
          return '趸交'
        } else {
          return pay_year + '年交'
        }
      },
      setAddons (i) {
        var tml = {
          safe_id: i, //险种
          safe_year: '', //保险期间
          pay_year: '', //交费年期
          money: '', //基本保险金额
          period_money: '' //年缴保费
        }
        switch (i) {
          case '362':
            tml.pay_year = this.insurance.pay_year
            tml.money = this.insurance.money
            break
          default:
            break
        }
        this.addonIns[i] = tml
      },
      cal (addonIndex) {
        var vm = this
        if (!vm.checkForm() || vm.uploading) {
          return
        }
        if (addonIndex && !vm.checkAddonForm(addonIndex)) {
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
        pushData['warranty_is_save'] = 2
        pushData['warranty_source'] = 2

        pushData['insurance_war_id'] = []
        pushData['insurance_money'] = []
        pushData['insurance_pay_year'] = []
        pushData['insurance_safe_id'] = []
        pushData['insurance_safe_year'] = []

        let insurance = vm.insurance
        pushData['insurance_war_id'].push('')
        pushData['insurance_money'].push(insurance.money)
        pushData['insurance_pay_year'].push(insurance.pay_year)
        pushData['insurance_safe_id'].push(insurance.safe_id)
        pushData['insurance_safe_year'].push(insurance.safe_year)

        if (addonIndex) {  // 附加险
          insurance = vm.addonIns[addonIndex]
          pushData['insurance_war_id'].push('')
          pushData['insurance_money'].push(insurance.money)
          pushData['insurance_pay_year'].push(insurance.pay_year)
          pushData['insurance_safe_id'].push(insurance.safe_id)
          pushData['insurance_safe_year'].push(insurance.safe_year)
        }

        // console.log(pushData)
        Api.pushWarranty(qs.stringify(pushData), res => {
          if (res.name && res.name.indexOf('Error') > -1) {
            vm.$toast.open('服务器开小差了', 'error')
            return
          }
          if (res.status === '0') {
            console.info(res.message)
            vm.$toast.open('计算失败：' + res.message)
          } else {
            vm.$toast.close()
            if (addonIndex) {
              vm.addonIns[addonIndex].period_money = res.data[addonIndex]
              vm.$forceUpdate()
            } else {
              vm.insurance.period_money = res.data[vm.insurance.safe_id]
              vm.$store.dispatch('setApplicant', {
                'appl_id': res.id.appl_id
              })
              vm.$store.dispatch('saveAssured', {
                'assu_id': res.id.assu_id
              })

              if (vm.addonIns[362]) {
                vm.addonIns[362].money = this.insurance.money
              }
              // 是否达到反洗钱标准
              vm.$store.dispatch('setAntiMoney', (res.data[vm.insurance.safe_id] * this.mainPayYear >= 200000))
            }
          }
        })
      },
      insurance_changed () {
        this.insurance.safe_id = this.main_insurance.safe_id
        this.attr = this.unique(this.main_insurance.attr, 'pay_year')
        this.attr2 = this.unique(this.main_insurance.attr, 'safe_year')

        // 初始化值
        this.addonIns = {}
        this.addonsSelected = {}
        this.insurance.period_money = ''
        if (this.attr.length === 1) {
          this.insurance.pay_year = this.attr[0].sv_id
          this.mainPayYear = Number(this.attr[0].pay_year)
        } else {
          this.insurance.pay_year = ''
          this.mainPayYear = ''
        }
        if (this.attr2.length === 1) {
          this.insurance.safe_year = this.attr2[0].sv_id
          this.mainSafeYear = Number(this.attr2[0].safe_year)
        } else {
          this.insurance.safe_year = ''
          this.mainSafeYear = ''
        }
        this.checkAge()
        for (let i in this.main_insurance.child) {
          this.setAddons(i)
        }
      },
      checkEmail () {
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
      chAddonState (index) {
        if (!this.addonIns[index]) return
        this.$forceUpdate()
      },
      checkMoney (index) {
        var id = index || this.main_insurance.safe_id
        var money = index ? this.addonIns[index].money : +this.insurance.money
        var toast_text = null
        if (index === '362') {
          this.addonIns[362].money = money
        }
        switch (id) {
          case '209':
            if (money < 50000 || money % 10000 !== 0) {
              toast_text = '最低保额为5万元，且为1万元整数倍'
            }
            break
          case '210':
            if (money < 300000 || money % 10000 !== 0) {
              toast_text = '最低保额为30万元，且为1万元整数倍'
            }
            break
          case '361':
            if (money < 50000 || money % 1000 !== 0) {
              toast_text = '最低保额为5万元，且为1千元整数倍'
            }
            break
          default:
            break
        }
        if (toast_text) {
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return true
      },
      checkAge (index) {
        var vm = this
        var age = Api.getAge(vm.$store.state.assured.birthday)
        var id = index || this.insurance.safe_id
        if (age > 60 && (id === '209' || id === '361')) {
          vm.$toast.open('被保险人年龄不能大于60周岁', '')
          return false
        } else if (age > 50 && id === '210') {
          vm.$toast.open('被保险人年龄不能大于50周岁', '')
          return false
        }
        return true
      },
      checkAddonForm (index) {
        const insurance = this.addonIns[index]
        if (!insurance) return false
        var toast_text = null
        if (!insurance.safe_id) {
          toast_text = '请选择险种'
        } else if (!insurance.safe_year) {
          toast_text = '请选择保险期间'
        } else if (!insurance.pay_year) {
          toast_text = '请选择交费年期'
        } else if (!insurance.money) {
          toast_text = '请填写基本保险金额'
        }
        if (toast_text) {
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return this.checkMoney(index) && this.checkAge()
      },
      checkForm () {
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
