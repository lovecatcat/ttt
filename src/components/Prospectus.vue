<template>
  <section id="Prospectus" class="pd-b47">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">险种信息</div>
      <div class="am-list-body">
        <div class="am-list-item ">
          <div class="am-list-label">险种</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly v-model="insurance.name"
                   @click="toShow">
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <template v-if="insurance.safe_id">
          <app-input label="保险期间" class="am-list-control-button">
            <button slot="button" class="am-button tiny" :class="{'tiny-blue':item.year===insurance.safe_year}" :disabled="item.year===insurance.safe_year" v-for="(item,index) in mainSyAttr" @click="insurance.safe_year=item.year, resetFee()">
              {{item.year, insurance.safe_id | safeYearFilter}}
            </button>
          </app-input>
          <app-input label="缴费年限" class="am-list-control-button">
            <button slot="button" class="am-button tiny" :class="{'tiny-blue':item.pay_year===insurance.pay_year}" :disabled="item.pay_year===insurance.pay_year" v-for="(item,index) in mainPyAttr" @click="insurance.pay_year=item.pay_year, resetFee()">
              {{item.pay_year | payYearFilter}}
            </button>
          </app-input>
          <!--//百万健康-->
          <template v-if="insurance.code === '12D00080'">
            <app-input label="年缴保费(元)">
              <input slot="input" v-model="insurance.period_money" type="number" placeholder="请填写年缴保费(元)"
                     @blur="moneyChanged">
              <div slot="icon" v-show="insurance.period_money != ''" class="am-list-clear">
                <i class="am-icon-clear am-icon" @click="insurance.period_money = ''"></i>
              </div>
            </app-input>
            <div class="am-list-item ">
              <div class="am-list-label">基本保额(元)</div>
              <div class="am-list-control" style="width: 70%">
                <input slot="input" type="text" readonly @change="insurance.period_money = ''"  placeholder="基本保险金额（元）" v-model.number.lazy="insurance.money">
              </div>
              <div  class="am-list-change orange" @click="cal(false)">
                点击计算
              </div>
            </div>
          </template>

          <template v-else-if="insurance.code === '13F00150'">
            <app-input label="保险金额">
              <input slot="input" @change="insurance.period_money = ''" v-model.number.lazy="insurance.money"
                     type="number"
                     placeholder="请填写基本保险金额（元）" @blur="moneyChanged">
              <div slot="icon" v-show="insurance.money !== ''" class="am-list-clear">
                <i class="am-icon-clear am-icon" @click="insurance.money = ''"></i>
              </div>
            </app-input>
            <div class="am-list-item ">
              <div class="am-list-label">年缴保费(元)</div>
              <div class="am-list-control" style="width: 70%">
                <input slot="input" type="text" readonly @change="insurance.period_money = ''"   placeholder="年缴保费（元）" v-model="insurance.period_money">
              </div>
              <div  class="am-list-change orange" @click="cal(false)">
                点击计算
              </div>
            </div>
          </template>
          <div style="padding: .1rem">
            <div class="am-list-switch">是否自动垫交保费</div>
              <div class="am-switch">
                <input type="checkbox" name="s1" class="am-switch-checkbox" checked="checked" v-model="insurance.autoApl" :true-value="true" :false-value="false">
                <label class="am-switch-label" for="demo-s-1">
                  <div class="am-switch-inner"></div>
                  <div class="am-switch-switch"></div>
                </label>
              </div>
          </div>
        </template>
      </div>
    </div>

    <template v-if="insurance.safe_id && Addons">
      <!--<div class="app-list-header">附加险</div>-->
      <app-dropdown
                  v-for="(item,index) in Addons"
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
      <!--百万健康两全-->
        <template v-if="index==='31A00050' && addonsSelected[index]">
          <app-input label="保险期间" class="am-list-control-button">
            <button slot="button" class="am-button tiny" :class="{'tiny-blue':sitem.year===addonIns[index].safe_year}" :disabled="sitem.year===addonIns[index].safe_year"
                    v-for="sitem in unique(item.ratio, 'year')" @click="addonIns[index].safe_year=sitem.year, addonIns[index].period_money = '', $forceUpdate()">
              {{sitem.year | safeYearFilter}}
            </button>
          </app-input>
          <app-input label="缴费年限" class="am-list-control-button" v-if="insurance.pay_year">
            <button slot="button" class="am-button tiny tiny-blue" >
              {{insurance.pay_year}}年交
            </button>
          </app-input>
          <app-input label="保险金额(元)" class="am-list-control-button" v-if="insurance.money">
            <button slot="button" class="am-button tiny tiny-blue" >
              {{insurance.money}}
            </button>
          </app-input>
          <div class="am-list-item ">
            <div class="am-list-label">年缴保费(元)</div>
            <div class="am-list-control" style="width: 70%">
              <input slot="input" type="text" readonly  v-model="addonIns[index].period_money"   placeholder="年缴保费（元）">
            </div>
            <div  class="am-list-change orange" @click="cal(index)">
              点击计算
            </div>
          </div>
        </template>
      <!--金掌柜-->
      <template v-else-if="index==='12E20010'">
        <app-input label="保险期间" class="am-list-control-button" v-if="insurance.safe_year">
          <button slot="button" class="am-button tiny tiny-blue" >
            {{insurance.safe_year | safeYearFilter}}
          </button>
        </app-input>
        <app-input label="缴费年限" class="am-list-control-button">
          <button slot="button" class="am-button tiny tiny-blue" >
            1年交
          </button>
        </app-input>
        <app-input label="年缴保费(元)">
          <input slot="input"
                 v-model="addonIns[index].period_money"
                 type="text"
                 placeholder="请输入">
        </app-input>
      </template>
        <!--附加豁免-->
        <template v-else-if="index==='33F00030' && addonIns[index].period_money && addonsSelected[index]">
          <div class="hm">
            <div v-if="addonsSelected['31A00050']">保险金额(元)<span>{{Number(insurance.period_money) + Number(addonIns['31A00050'].period_money)}}</span></div>
            <div v-else>保险金额(元)<span>{{insurance.period_money}}</span></div>
            <div >交费期间(年)<span>{{insurance.pay_year - 1}}年</span></div>
            <div >保障期间(年)<span>终身</span></div>
            <div >年缴保费(元)<span>{{addonIns[index].period_money}}</span></div>
          </div>

        </template>
    </app-dropdown>
    </template>
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">保单信息</div>
      <div class="am-list-body">
        <app-input label="保单选项" class="am-list-control-button">
          <button slot="button" class="am-button tiny" :class="{'tiny-blue':item.value===insurance.GetPolMode}" :disabled="item.value===insurance.GetPolMode"
                  v-for="item in init.GetPolMode" @click="insurance.GetPolMode =item.value">
            {{item.text}}
          </button>

        </app-input>
        <app-input label="邮箱" v-if="insurance.GetPolMode === 'LAS0003'">
          <input slot="input" v-model.lazy="email" type="email" placeholder="请输入" readonly>
        </app-input>
        <div class="am-list-footer" v-if="insurance.GetPolMode === 'LAS0003'">
          仅发送电子保单到投保人邮箱里
        </div>
        <div class="am-list-footer" v-else>
          仅打印纸质保单（包含回执），不发送电子保单
        </div>
      </div>
    </div>

    <div class="am-button-group am-fixed am-fixed-bottom" role="group" aria-label="操作按钮组">
      <button type="button" class="am-button white"><router-link :to="back">上一步</router-link></button>
      <button type="button" class="am-button blue"><router-link to="/beneficiaries">下一步</router-link></button>
    </div>
    <!--vue-pickers-->
    <vue-pickers :show="show" :columns="columns" :selectData="pickData" @cancel="close"
                 @confirm="confirmFn"></vue-pickers>
  </section>
</template>
<script>
  import Api from '../api'
  import vuePickers from 'vue-pickers'
  import {
    mapGetters
  } from 'vuex'
  const bwjk = '13F00150'
  const qwrs = '12D00080'
  const bwjklq = '31A00050'
  const fjhm = '33F00030'
  const jzg = '12E20010'

  export default {
    name: 'prospectus',
    components: {
      vuePickers
    },
    data() {
      return {
        back: '/beinsured',
        uploading: false,
        insurance: {
          name: '',
          code: '', //险种代码
          is_main: true,
          safe_id: '', //险种
          safe_year: '', //保险期间
          pay_year: '', //交费年期
          money: '', //基本保险金额
          period_money: '', //期交保费
          autoApl: false, //是否自动垫交
          GetPolMode: 'LAS0003' //保单递送方式
        },
        mainPyAttr: null, //保险属性
        mainSyAttr: null, //保险属性
        mainPayYear: '', //主险缴费期间
        mainSafeYear: '', //主险保障期间

        Addons: {},
        addonIns: {}, //附加险信息
        addonsSelected: {}, //附加险投保状态
        safegoods: [], //保险产品
        main_insurance: {}, //选中的主险
        isCopy: '',
        res: null,
        show: false,
        columns: 1,
        pickData: {
          data1: []
        }
      }
    },
    computed: {
      ...mapGetters([
        'assuAge',
        'applAge'
      ]),
      init() {
        return this.$store.state.init || {}
      },
      email() {
        return this.$store.state.applicant.holder_email
      },
      is_assured() {
        return this.$store.state.applicant.is_assured
      }
    },
    filters: {
      safeYearFilter: function(value) {
        if (value > 50 && value !== '999' && value !== 999) {
          return '至' + value + '周岁'
        } else if (value < 50 && value > 0) {
          return value + '年'
        } else {
          return '终身'
        }
      },
      payYearFilter: function(value) {
        if (value === 1) {
          return '趸交'
        } else if (value < 60) {
          return value + '年交'
        } else {
          return '至' + value + '岁'
        }
      }
    },
    created() {
      let user_id = this.$store.state.user_id
      // this.setData('insurance', this.$storage.fetch('insurance'))
      Api.querySafegoods(user_id, res => {
        if (res.name && res.name.indexOf('Error') > -1) {
          this.$toast.open('服务器开小差了', 'error')
          return
        }
        this.safegoods = res
      })
    },
    activated() {
      if (this.$store.state.applicant.is_assured === 'LBK0001') {
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
      if (this.insurance.GetPolMode === 'LAS0003' && !this.checkEmail()) {
        return false
      }
      this.save2local('insurance', this.insurance)
      this.$store.commit('saveInsurance', JSON.parse(JSON.stringify(insurances)))
      next()
    },
    methods: {
      close() {
        console.log(123)
        this.show = false
      },
      confirmFn(val) {
        console.log(val)
        this.show = false
        this.defaultData = [val.select1]
        this.insurance.name = val.select1.text
        this.insurance.safe_id = val.select1.value
        this.insurance.code = val.select1.code
        let vm = this
        this.safegoods.forEach(function (item, index) {
          if (item.code === val.select1.code) {
            vm.main_insurance = item
            vm.insurance_changed()
          }
        })
      },
      toShow(type) {
        document.activeElement.blur()
        let data = []
        this.safegoods.forEach(function (item, index) {
          if (item.code === bwjk || item.code === qwrs) {
            data.push({
              text: item.name,
              value: item.id,
              code: item.code
            })
          }
        })
        this.pickData.data1 = data
        this.show = true
      },
      //失去焦点
      toblur() {
        document.activeElement.blur()
      },
      // 去重
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
      //切换险种
      insurance_changed() {
        let vm = this
        // 初始化值
        this.Addons = {}
        this.addonIns = {}
        this.addonsSelected = {}
        this.insurance.period_money = ''
        this.insurance.money = ''
        //附加险
        if (this.main_insurance.child) {
          for (let i = 0; i < this.main_insurance.child.length; i++) {
            let child = {
              name: this.main_insurance.child[i].name,
              safe_id: this.main_insurance.child[i].id,
              code: this.main_insurance.child[i].code,
              ratio: this.main_insurance.child[i].ratio
            } //附加险
            vm.Addons[this.main_insurance.child[i].code] = child
          }
        }
        // 缴费年限
        let mainPyAttr = vm.unique(this.main_insurance.ratio, 'pay_year') // 去重
        mainPyAttr = mainPyAttr.sort(function(a, b) { // 排序
          return a.pay_year - b.pay_year
        })
        vm.mainPyAttr = mainPyAttr
        if (mainPyAttr.length === 1) {
          vm.insurance.pay_year = mainPyAttr[0].pay_year
        } else {
          vm.insurance.pay_year = ''
        }
        // 保险期间
        let mainSyAttr = vm.unique(this.main_insurance.ratio, 'year') // 去重
        mainSyAttr = mainSyAttr.sort(function(a, b) { // 排序
          return a.pay_year - b.pay_year
        })
        vm.mainSyAttr = mainSyAttr
        //长度为1直接赋值，不为1置为空
        if (mainSyAttr.length === 1) {
          vm.insurance.safe_year = mainSyAttr[0].year
        } else {
          vm.insurance.safe_year = ''
        }
        // this.checkAge()
        //设置附加险默认值
        for (let i in this.Addons) {
          this.setAddons(i, this.Addons[i].safe_id)
        }
      },
      // 重置主险费用及附加险
      resetFee() {
        if (this.insurance.code === qwrs) {
          this.insurance.money = ''
        } else {
          this.insurance.period_money = ''
        }
      },
      moneyChanged() {
        this.resetAdddons()
        this.checkMoney()
      },
      resetAdddons() {
        for (let i in this.addonIns) {
          this.setAddons(i, this.Addons[i].safe_id)
        }
      },
      setAddons(i, id) {
        let tml = {
          code: i,
          name: '',
          safe_id: id, //险种
          safe_year: '', //保险期间
          pay_year: '', //交费年期
          money: '', //基本保险金额
          period_money: '', //年缴保费
          autoApl: false //是否自动垫交
        }
        switch (i) {
          case bwjklq:
            tml.name = '附加信泰百万健康两全保险'
            tml.pay_year = this.insurance.pay_year
            tml.money = this.insurance.money
            break
          case jzg:
            tml.name = '金掌柜年金保险'
            tml.pay_year = 1
            tml.safe_year = 999
            tml.money = 0
            break
          case fjhm:
            tml.name = '附加投保人豁免保险费重大疾病保险'
            tml.pay_year = this.insurance.pay_year - 1
            tml.safe_year = this.insurance.safe_year
            tml.money = this.insurance.period_money
            break
          default:
            break
        }
        this.addonIns[i] = tml
        this.addonsSelected = {}
      },
      cal(addonIndex) {
        console.log('计算【' + addonIndex + '】')
        console.log(typeof addonIndex)
        let vm = this
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
        // console.log(pushData)
        let basedata = {
          user_id: this.$store.state.user_id,
          double_main_risk: '',
          productInfo: [],
          insurant: {
            birthday: vm.$store.state.assured.insured_birthday || '1987-01-01', //vm.assured.insured_birthday
            genderCode: vm.$store.state.assured.insured_gender || 'LAB0009' //vm.assured.insured_gender
          },
          applicant: {
            birthday: vm.$store.state.applicant.holder_birthday || '1987-01-01', //vm.applicant.hpo5  older_birthday,
            genderCode: vm.$store.state.applicant.holder_gender || 'LAB0009' //vm.applicant.holder_gender
          }
        }
        let main = {}
        main.productId = vm.insurance.safe_id
        main.pay = vm.insurance.pay_year
        main.insure = vm.insurance.safe_year
        if (vm.insurance.code === bwjk) {
          main.amount = vm.insurance.money.toString()
          main.premium = ''
        } else if (vm.insurance.code === qwrs) {
          main.premium = vm.insurance.period_money.toString()
          main.amount = ''
          main.autoApl = vm.insurance.autoApl ? 1 : 0
        }

        basedata.productInfo.push(main)
        console.log(JSON.stringify(basedata))
        //是附加险
        if (addonIndex) {
          // if (!vm.checkAddonMoney(index)) {
          //   return false
          // }
          if (addonIndex === bwjklq) {
            let product = {}
            product.productId = vm.addonIns[addonIndex].safe_id
            product.pay = vm.addonIns[addonIndex].pay_year
            product.insure = vm.addonIns[addonIndex].safe_year
            product.amount = vm.addonIns[addonIndex].money
            product.premium = ''
            console.log(JSON.stringify(product))
            basedata.productInfo.push(product)
          } else if (addonIndex === fjhm) {
            let product = {}
            product.productId = vm.addonIns[addonIndex].safe_id
            product.pay = vm.addonIns[addonIndex].pay_year
            product.insure = vm.addonIns[addonIndex].safe_year
            product.amount = vm.addonsSelected[bwjklq] ? Number(vm.insurance.period_money) + Number(vm.addonIns[bwjklq].period_money) : vm.insurance.period_money
            product.premium = ''
            console.log(JSON.stringify(product))
            basedata.productInfo.push(product)
          }
        }
        console.log(JSON.stringify(basedata))
        let data = {
          msg: basedata,
          company_code: 'XinTai',
          method: 'test_calc'
        }
        Api.calMoney(JSON.stringify(data), res => {
          if (res.code && res.data) {
            vm.$toast.close()
            if (addonIndex) {
              console.log('试算附加险' + addonIndex + '成功')
              let data = res.data[1]
              vm.addonIns[addonIndex].period_money = data.Prem
              vm.addonIns[addonIndex].money = data.Amnt
              if (addonIndex === bwjklq) {
                vm.cal(fjhm)
              }
              this.$forceUpdate()
            } else {
              console.log('试算主险成功')
              let data = res.data[0]
              if (data.RiskCode === bwjk) {
                vm.insurance.period_money = data.Prem
              } else if (data.RiskCode === qwrs) {
                vm.insurance.money = data.Amnt
              }

              // 重置附加险
              vm.resetAdddons()
              // 是否达到反洗钱标准
              vm.$store.dispatch('setAntiMoney', (vm.insurance.period_money * vm.insurance.pay_year >= 200000))
            }
          } else {
            if (!res.msg) {
              vm.$toast.open('网络繁忙，请稍后再试', 'warn')
            } else {
              vm.$toast.open(res.msg, 'error')
            }
          }
        })
      },
      checkEmail() {
        const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        const vm = this
        let toast_text = null
        if (!vm.email) {
          toast_text = '邮箱不能为空'
        } else if (!reg.test(vm.email)) {
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
        let mainPayYear = this.insurance.pay_year
        // if (!this.addonIns[index]) return
        if (this.addonsSelected[index]) {
          if (!this.insurance.period_money && this.insurance.code === bwjk) {
            toast_text = '请先计算主险年缴保费'
          } else if (!this.insurance.money && this.insurance.code === qwrs) {
            toast_text = '请先计算主险基本保额'
          } else {
            if (index === fjhm) { // 附加投保人豁免
              if (mainPayYear < 5) {
                toast_text = '主险交费年期≥5年，方可附加本险种'
              } else if (this.$store.state.applicant.is_assured === 'LBK0001') {
                toast_text = '投、被保险人为同一人时，不可附加本险种'
              } else if (this.applAge > 60 || this.applAge < 18) {
                toast_text = '附加本险种时，投保人年龄应为18至60周岁'
              }
            } else if (index === jzg) { //金掌柜年金保险（万能型）
              if (!this.addonIns[index].period_money) {
                toast_text = '【金掌柜年金保险】请先输入年缴保费'
              } else if (this.addonIns[index].period_money < 1000 || this.addonIns[index].period_money % 1000 !== 0) {
                toast_text = '【金掌柜年金保险】保费最低为1000元，且为千元整数倍'
              }
            }
          }
        } else {
          if (index === bwjklq) {
            this.cal(fjhm)
          }
        }
        if (toast_text) {
          this.addonsSelected[index] = false
          this.$toast.open(toast_text, 'warn')
        } else {
          if (this.addonsSelected[index] && index === fjhm) {
            this.cal(index)
          } else if (this.addonsSelected[fjhm] && index === bwjklq) {
            this.cal(fjhm)
          }
        }
        this.$forceUpdate()
      },
      checkMoney(index) {
        let id = index || this.insurance.code
        let money = index ? this.addonIns[index].money : +this.insurance.money
        let period_money = index ? this.addonIns[index].period_money : +this.insurance.period_money
        let toast_text = null
        if (index === '362') {
          this.addonIns[362].money = money
        }
        switch (id) {
          case bwjk:
            if (money < 50000 || money % 1000 !== 0) {
              toast_text = '最低保额为5万元，且为1千元整数倍'
            }
            break
          case qwrs:
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
        let assuAge = vm.assuAge || 0
        let toastText = null
        let id = index || vm.insurance.code
        let mainPayYear = this.mainPayYear
        switch (id) {
          case bwjk: // 信泰百万健康重大疾病
            if (mainPayYear === 1 && assuAge > 60) {
              toastText = '被保人年龄不能大于60周岁'
            } else if (mainPayYear === 3 && assuAge > 60) {
              toastText = '3年交被保人年龄不能大于60周岁'
            } else if (mainPayYear === 5 && assuAge > 60) {
              toastText = '5年交被保人年龄不能大于60周岁'
            } else if (mainPayYear === 10 && assuAge > 60) {
              toastText = '10年交被保人年龄不能大于60周岁'
            } else if (mainPayYear === 15 && assuAge > 55) {
              toastText = '15年交被保人年龄不能大于55周岁'
            } else if (mainPayYear === 20 && assuAge > 50) {
              toastText = '20年交被保人年龄不能大于50周岁'
            } else if (mainPayYear === 30 && assuAge > 40) {
              toastText = '30年交被保人年龄不能大于40周岁'
            }
            break
          case qwrs: // 信泰千万人生
            if (assuAge > 55) {
              toastText = '被保人年龄不能大于55周岁'
            } else if (mainPayYear === 10 && assuAge > 50) {
              toastText = '10年交被保人年龄不能大于50周岁'
            }
            break
          case '31A00050': // 附加信泰百万健康重大疾病
            if (mainPayYear === 1 && assuAge > 50) {
              toastText = '被保人年龄不能大于50周岁'
            } else if (mainPayYear === 3 && assuAge > 50) {
              toastText = '3年交被保人年龄不能大于50周岁'
            } else if (mainPayYear === 5 && assuAge > 50) {
              toastText = '5年交被保人年龄不能大于50周岁'
            } else if (mainPayYear === 10 && assuAge > 50) {
              toastText = '10年交被保人年龄不能大于50周岁'
            } else if (mainPayYear === 15 && assuAge > 45) {
              toastText = '15年交被保人年龄不能大于45周岁'
            } else if (mainPayYear === 20 && assuAge > 40) {
              toastText = '20年交被保人年龄不能大于40周岁'
            } else if (mainPayYear === 30 && assuAge > 35) {
              toastText = '30年交被保人年龄不能大于35周岁'
            }
            break
        }
        if (toastText) {
          this.$toast.open(toastText, 'warn')
          return false
        }
        return true
      },
      checkAddonForm(index) {
        console.log(index)
        const insurance = this.addonIns[index]
        if (!insurance) return false
        let toast_text = null
        if (!insurance.safe_id) {
          toast_text = '请选择险种'
        } else if (!insurance.safe_year) {
          toast_text = '请选择保险期间'
        } else if (!insurance.pay_year && index !== fjhm) {
          toast_text = '请选择交费年期'
        } else if (!insurance.money && index !== jzg) {
          toast_text = '请计算基本保险金额'
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
        if (!vm.insurance.code) {
          toast_text = '请选择险种'
        } else if (!vm.insurance.safe_year) {
          toast_text = '请选择保险期间'
        } else if (!vm.insurance.pay_year) {
          toast_text = '请选择交费年期'
        } else if (vm.insurance.code === bwjk && !vm.insurance.money) {
          toast_text = '请填写保险金额'
        } else if (vm.insurance.code === qwrs && !vm.insurance.period_money) {
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
