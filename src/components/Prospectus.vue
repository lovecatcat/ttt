<template>
  <div id="Prospectus">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header"><span class="app-iconfont">&#xe631;</span>选择险种信息</div>
      <div class="am-list-body">
        <app-select label="险种" :readonly="safe_id" v-if="safegoods">
          <select v-model="main_insurance" @change="insurance_changed" :disabled="safe_id">
            <option disabled value="0">请选择</option>
            <option v-if="item.safe_id == 361 || item.safe_id == 377"
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
        <app-input label="是否自动垫交保费" autoWidth>
          <div class="am-ft-right" slot="input">
            <div class="am-switch" v-if="init.warranty && init.warranty.mattress_sign">
              <input type="checkbox"
                     class="am-switch-checkbox"
                     id="mattress_sign"
                     v-bind:true-value="init.warranty.mattress_sign[1].if_id"
                     v-bind:false-value="init.warranty.mattress_sign[0].if_id"
                     v-model="insurance.auto_pay">
              <label class="am-switch-label" for="mattress_sign">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
        </app-input>
        <template v-if="insurance.safe_id==='377'">
          <app-input label="期交保费">
            <input slot="input" v-model="insurance.period_money" type="number" placeholder="请填写期交保费(元)"
                   @blur="moneyChanged">
            <div slot="icon" v-show="insurance.period_money != ''" class="am-list-clear">
              <i class="am-icon-clear am-icon" @click="insurance.period_money = ''"></i>
            </div>
          </app-input>
          <app-input label="基本保险金额">
            <input slot="input" readonly @change="insurance.period_money = ''" v-model.number.lazy="insurance.money"
                   type="number" placeholder="请填写基本保险金额（元）">
            <div slot="button" class="am-list-button" @click="cal(false)">
              <button type="button">点击计算</button>
            </div>
          </app-input>
        </template>
        <template v-else>
          <app-input label="基本保险金额">
            <input slot="input" @change="insurance.period_money = ''" v-model.number.lazy="insurance.money"
                   type="number"
                   placeholder="请填写基本保险金额（元）" @blur="moneyChanged">
            <div slot="icon" v-show="insurance.money != ''" class="am-list-clear">
              <i class="am-icon-clear am-icon" @click="insurance.money = ''"></i>
            </div>
          </app-input>
          <app-input label="期交保费">
            <input slot="input" readonly v-model="insurance.period_money" type="text" placeholder="期交保费(元)">
            <div slot="button" class="am-list-button" @click="cal(false)">
              <button type="button">点击计算</button>
            </div>
          </app-input>
        </template>
      </div>
    </div>
    <div class="app-list-header">附加险</div>
    <app-dropdown v-if="addonIns[index] && ['370','362','398'].indexOf(index) > -1 "
                  :id="index" :ref="'applicant_'+index"
                  v-show="(mainPayYear > 3 && $store.state.warranty.is_assured !== 15000 && applAge < 61 && index === '370') || index !=='370'"
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
      <!--金掌柜-->
      <template v-if="index==='398'">
        <app-select label="保险期间" :readonly="item.attr.length===1">
          <select v-model="addonIns[index].safe_year" :disabled="item.attr.length===1">
            <option disabled value="">请选择</option>
            <option v-for="sitem in unique(item.attr, 'safe_year')"
                    :value="sitem.sv_id" :key="sitem.sv_id"
                    v-text="showSafeYear(sitem.safe_year)"></option>
          </select>
        </app-select>
        <app-input label="保费">
          <input slot="input"
                 v-model="addonIns[index].period_money"
                 type="text"
                 placeholder="请输入">
        </app-input>
        <app-input label="是否自动垫交保费" autoWidth>
          <div class="am-ft-right" slot="input">
            <div class="am-switch" v-if="init.warranty && init.warranty.mattress_sign">
              <input type="checkbox"
                     class="am-switch-checkbox"
                     v-bind:true-value="init.warranty.mattress_sign[1].if_id"
                     v-bind:false-value="init.warranty.mattress_sign[0].if_id"
                     v-model="addonIns[index].auto_pay">
              <label class="am-switch-label" for="mattress_sign">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
        </app-input>
      </template>
      <template v-else>
        <app-select label="交费期间" readonly>
          <select v-model="addonIns[index].pay_year" disabled
                  @change="addonIns[index].period_money = '',$forceUpdate()">
            <option disabled value="">请选择</option>
            <option v-for="pitem in unique(item.attr,'pay_year')"
                    :value="pitem.sv_id" :key="pitem.sv_id"
                    v-text="showPayYear(pitem.pay_year)"></option>
          </select>
        </app-select>
        <app-select label="保险期间" :readonly="item.attr.length===1">
          <select v-model="addonIns[index].safe_year" :disabled="item.attr.length===1"
                  @change="addonIns[index].period_money = '',$forceUpdate()">
            <option disabled value="">请选择</option>
            <option v-for="sitem in unique(item.attr, 'safe_year')"
                    :value="sitem.sv_id" :key="sitem.sv_id"
                    v-text="showSafeYear(sitem.safe_year)"></option>
          </select>
        </app-select>
        <app-input label="基本保险金额">
          <input slot="input" readonly v-model.number="addonIns[index].money" type="number"
                 :placeholder="index === '362' ? '与主险保持一致' : '主险和附加长险的期交保费之和'">
        </app-input>
        <app-input label="期交保费">
          <input slot="input" readonly
                 v-model="addonIns[index].period_money"
                 type="text"
                 placeholder="请点击计算">
          <div slot="button" class="am-list-button" @click="cal(index)">
            <button type="button">点击计算</button>
          </div>
        </app-input>
      </template>

    </app-dropdown>
    <div class="am-list am-list-6lb form">
      <div class="am-list-body">
        <app-select label="保单选项">
          <select v-model="warranty.delivery_way" v-if="init.warranty">
            <option v-if="item.if_id !== '116'" v-for="item in init.warranty.delivery_way" :value="item.if_id">
              {{item.explain}}
            </option>
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
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'prospectus',
    data() {
      return {
        back: '/beinsured',
        uploading: false,
        safe_id: $_GET['safe_id'] || false,
        insurance: {
          safe_id: '', //险种
          safe_year: '', //保险期间
          pay_year: '', //交费年期
          money: '', //基本保险金额
          period_money: '', //期交保费
          auto_pay: '77' //自动垫交
        },
        warranty: {
          proposal_cont_no: '', //双主险投保单号
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
      ...mapGetters([
        'assuAge',
        'applAge'
      ]),
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
      addonIns: { //附加险信息
        get() {
          return this.$store.state.addonIns
        },
        set(val) {
          this.$store.commit('setParam', {
            addonIns: val
          })
        }
      },
      init() {
        return this.$store.state.init || {}
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
        if (this.safe_id) {
          vm.main_insurance = res[this.safe_id]
          vm.insurance_changed()
        }
//        if (vm.$store.state.todo && vm.$storage.fetch('main_insurance').safe_id) {
//          vm.setData('main_insurance', vm.$storage.fetch('main_insurance'))
//          vm.$nextTick(function () {
//            vm.attr = this.unique(vm.main_insurance.attr, 'pay_year')
//            vm.attr2 = this.unique(vm.main_insurance.attr, 'safe_year')
//            let insurance = vm.$storage.fetch('insurance')
//            this.insurance.safe_id = insurance.safe_id
//            this.insurance.money = insurance.money
//            this.insurance.pay_year = insurance.pay_year
//            if (vm.attr2.length === 1) {
//              this.insurance.safe_year = vm.attr2[0].sv_id
//            }
//          })
//        }
      })
    },
    activated() {
      if (this.$store.state.warranty.is_assured === 15000) {
        this.addonsSelected[370] = false
        this.back = '/insured'
      } else {
        this.back = '/beinsured'
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.path !== '/insured' && from.path !== '/beinsured') {
          return
        }
        if (vm.insurance) {
          vm.insurance.period_money = ''
          vm.insurance.money = ''
        }
        for (let i in vm.addonIns) {
          if (vm.addonIns[i] && vm.addonIns[i].period_money) {
            vm.addonIns[i].period_money = ''
          }
        }
      })
    },
    beforeRouteLeave(to, from, next) {
      if (to.path === '/insured' || to.path === '/beinsured') {
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
      if (!this.addonsSelected['398']) { //非双主险
        this.warranty.proposal_cont_no = ''
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
      unique(a, key) {
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
      resetMain() {
        if (this.insurance.safe_id === '377') {
          this.insurance.money = ''
        } else {
          this.insurance.period_money = ''
        }
      },
      pyChanged() {
        this.resetMain()
        let mainPayYear = null
        this.attr.forEach(item => {
          if (item.sv_id === this.insurance.pay_year) {
            mainPayYear = Number(item.pay_year)
          }
        })
        this.mainPayYear = mainPayYear
        if (!this.main_insurance.child) return
        // 百万健康两全保险
        this.main_insurance.child[362] && this.unique(this.main_insurance.child[362].attr, 'pay_year').forEach(item => {
          if (Number(item.pay_year) === mainPayYear) {
            this.addonIns[362].pay_year = item.sv_id
          }
        })
        //投保人豁免
        this.main_insurance.child[370] && this.unique(this.main_insurance.child[370].attr, 'pay_year').forEach(item => {
          if (Number(item.pay_year) === mainPayYear - 1) {
            this.addonIns[370].pay_year = item.sv_id
          }
        })
        //金掌柜
        this.main_insurance.child[398] && this.unique(this.main_insurance.child[398].attr, 'pay_year').forEach(item => {
          this.addonIns[398].safe_year = item.sv_id
          this.addonIns[398].pay_year = item.sv_id
        })
        this.resetAdddons()
      },
      syChanged() {
        this.resetMain()
        this.attr2.forEach(item => {
          if (item.sv_id === this.insurance.safe_year) {
            this.mainSafeYear = Number(item.safe_year)
          }
        })
        this.resetAdddons()
      },
      moneyChanged() {
        this.resetAdddons()
        this.checkMoney()
      },
      showSafeYear(safe_year) {
        if (safe_year === '999') {
          return '终身'
        } else if (Number(safe_year) > 50) {
          return '至' + safe_year + '岁'
        } else {
          return safe_year + '年'
        }
      },
      showPayYear(pay_year) {
        if (pay_year === '1') {
          return '趸交'
        } else {
          return pay_year + '年交'
        }
      },
      resetAdddons() {
        for (let i in this.addonIns) {
          this.addonIns[i].period_money = ''
        }
      },
      setAddons(i) {
        var tml = {
          safe_id: i, //险种
          safe_year: '', //保险期间
          pay_year: '', //交费年期
          money: '', //基本保险金额
          period_money: '', //年缴保费
          auto_pay: '77' //是否自动垫交
        }
        switch (i) {
          case '362':
            tml.pay_year = this.insurance.pay_year
            tml.money = this.insurance.money
            break
          case '370':
            let attr = this.unique(this.main_insurance.child[370].attr, 'safe_year')
            if (attr.length === 1) {
              tml.safe_year = attr[0].sv_id
            }
            break
          default:
            break
        }
        this.addonIns[i] = tml
      },
      cal(addonIndex) {
        console.log('计算【' + addonIndex + '】')
        console.log(typeof addonIndex)
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
        pushData['insurance_pay_year'] = []
        pushData['insurance_safe_id'] = []
        pushData['insurance_safe_year'] = []
        pushData['insurance_war_id'].push('')
        let insurance = {}
        if (addonIndex) {
          // 附加险
          pushData['insurance_money'] = []
          insurance = vm.addonIns[addonIndex]
          console.log(insurance)
          pushData['insurance_war_id'].push('')
          pushData['insurance_money'].push(insurance.money)
          pushData['insurance_pay_year'].push(insurance.pay_year)
          pushData['insurance_safe_id'].push(insurance.safe_id)
          pushData['insurance_safe_year'].push(insurance.safe_year)
        } else {
          insurance = vm.insurance
          console.log(insurance)
          if (vm.insurance.safe_id === '377') { //千万人生
            pushData['insurance_period_money'] = []
            pushData['insurance_period_money'].push(insurance.period_money)
          } else {
            pushData['insurance_money'] = []
            pushData['insurance_money'].push(insurance.money)
          }
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
            if (res.status === null) {
              vm.$toast.open('网络忙，请稍后再试', 'warn')
            } else {
              vm.$toast.close()
            }
            res.id.appl_id && vm.$store.dispatch('setApplicant', {
              'appl_id': res.id.appl_id
            })
            res.id.assu_id && vm.$store.dispatch('saveAssured', {
              'assu_id': res.id.assu_id
            })
            if (addonIndex) {
              console.log('cal_addon')
              let addoPm = res.data[addonIndex].period_money
              vm.addonIns[addonIndex].period_money = addoPm
              if (vm.addonIns[370] && this.addonsSelected[addonIndex]) {
                if (addonIndex !== '370') { //非豁免附加险
                  vm.addonIns[370].money = Number(vm.insurance.period_money) + Number(addoPm)
                  vm.addonIns[370].period_money = ''
                }
              }
              vm.$forceUpdate()
            } else {
              let period_money = res.data[vm.insurance.safe_id].period_money
              if (vm.insurance.safe_id === '377') {
                vm.insurance.money = res.data[vm.insurance.safe_id].money
              } else {
                vm.insurance.period_money = period_money
              }
              if (vm.addonIns[362]) {
                vm.addonIns[362].money = this.insurance.money
              }
              if (vm.addonIns[370]) {
                vm.addonIns[370].money = period_money
                vm.addonIns[370].period_money = ''
                if (vm.mainPayYear < 3 || vm.$store.state.warranty.is_assured !== 15000) {
                  this.addonsSelected[370] = false
                }
              }
              this.addonsSelected[398] = false
              // 是否达到反洗钱标准
              vm.$store.dispatch('setAntiMoney', (res.data[vm.insurance.safe_id] * this.mainPayYear >= 200000))
            }
          }
        })
      },
      insurance_changed() {
        this.insurance.safe_id = this.main_insurance.safe_id
        this.attr = this.unique(this.main_insurance.attr, 'pay_year')
        this.attr2 = this.unique(this.main_insurance.attr, 'safe_year')

        // 初始化值
        this.addonIns = {}
        this.addonsSelected = {}
        this.insurance.period_money = ''
        this.insurance.money = ''
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
      chAddonState(index) {
        let toast_text = null
        console.log(this.addonIns[index])
        if (!this.addonIns[index]) return
        if (index !== '370') {
          let money = Number(this.insurance.period_money)
          if (this.addonsSelected[index] === true) {
            money += Number(this.addonIns[index].period_money)
          }
          this.addonIns[370].money = money
          this.addonIns[370].period_money = ''
          if (index === '398') { //金掌柜年金保险（万能型）
            if (this.addonIns[index].period_money < 1000 || this.addonIns[index].period_money % 1000 !== 0) {
              toast_text = '【金掌柜年金保险】保费最低为1000元，且为千元整数倍'
            }
            if (this.addonsSelected[index] === true && !this.warranty.proposal_cont_no) {
              //获取投保单号
              Api.getDoubleOrderid(res => {
                console.log(res.data)
                if (res.name && res.name.indexOf('Error') > -1) {
                  this.$toast.open('服务器开小差了', 'error')
                  return
                }
                this.warranty.proposal_cont_no = res.data
              })
            }
          }
        } else { // 附加投保人豁免
          if (this.mainPayYear < 5) {
            toast_text = '主险交费年期≥5年，方可附加本险种'
          } else if (this.$store.state.warranty.is_assured === 15000) {
            toast_text = '投、被保险人为同一人时，不可附加本险种'
          } else if (this.applAge > 60 || this.applAge < 18) {
            toast_text = '附加本险种时，投保人年龄应为18至60周岁'
          }
        }
        if (toast_text) {
          this.addonsSelected[index] = false
          this.$toast.open(toast_text)
        }
        this.$forceUpdate()
      },
      checkMoney(index) {
        var id = index || this.main_insurance.safe_id
        var money = index ? this.addonIns[index].money : +this.insurance.money
        var period_money = index ? this.addonIns[index].period_money : +this.insurance.period_money
        var toast_text = null
        if (index === '362') {
          this.addonIns[362].money = money
        }
        switch (id) {
          case '361':
            if (money < 50000 || money % 1000 !== 0) {
              toast_text = '最低保额为5万元，且为1千元整数倍'
            }
            break
          case '377':
            if (this.mainPayYear === 1 && (period_money < 50000 || period_money % 1000 !== 0)) {
              toast_text = '趸交最低保费为5万元，且为1千元整数倍'
            } else if (this.mainPayYear !== 1 && (period_money < 10000 || period_money % 1000 !== 0)) {
              toast_text = '最低保费为1万元，且为1千元整数倍'
            }
            break
          default:
            break
        }
        if (money > 9999999999) {
          toast_text = '请输入合适的金额'
        }
        if (toast_text) {
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return true
      },
      checkAge(index) {
        let vm = this
        let age = vm.assuAge
        let toastText = null
        let id = index || vm.main_insurance.safe_id
        if (id === '377' && age > 55) {
          toastText = '【千万人生养老年金保险】被保人不能大于55周岁'
        } else if (id === '377' && this.mainPayYear === 10 && age > 50) {
          toastText = '【千万人生养老年金保险】10年交被保人不能大于50周岁'
        } else if (age > 60) {
          toastText = '被保险人不能大于60周岁'
        } else if (age + this.mainPayYear > 70) {
          toastText = '缴费期满时被保人不能超过70周岁'
        }
        if (toastText) {
          this.$toast.open(toastText)
          return false
        }
        return true
      },
      checkAddonForm(index) {
        console.log(typeof index)
        const insurance = this.addonIns[index]
        if (!insurance) return false
        var toast_text = null
        if (!insurance.safe_id) {
          toast_text = '请选择险种'
        } else if (!insurance.safe_year) {
          toast_text = '请选择保险期间'
        } else if (!insurance.pay_year && index !== '398') {
          toast_text = '请选择交费年期'
        } else if (!insurance.money && index !== '398') {
          toast_text = '请填写基本保险金额'
        }
        if (toast_text) {
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return this.checkMoney(index) && this.checkAge(index)
      },
      checkForm() {
        const vm = this
        let toast_text = null
        if (!vm.insurance.safe_id) {
          toast_text = '请选择险种'
        } else if (!vm.insurance.safe_year) {
          toast_text = '请选择保险期间'
        } else if (!vm.insurance.pay_year) {
          toast_text = '请选择交费年期'
        } else if (vm.insurance.safe_id === '361' && !vm.insurance.money) {
          toast_text = '请填写基本保险金额'
        } else if (vm.insurance.safe_id === '377' && !vm.insurance.period_money) {
          toast_text = '请填写年交保费'
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
