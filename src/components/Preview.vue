<template>
  <section id="preview">
    <div class="app-list-header am-flexbox" style="margin-bottom: .1rem">
      <div class="am-flexbox-item"><span class="app-iconfont">&#xe631;</span>信息确认</div>
    </div>
    <!--投保人信息-->
    <app-dropdown v-if="applicant" up='up'>
      <template slot="header">
        <div class="am-list-label">投保人信息</div>
        <div class="am-list-content am-ft-right">
          <router-link to="/insured"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </template>
      <div class="am-list-body">
        <app-input label="姓名">
          <input slot="input" v-model="applicant.holder_name" type="text" readonly>
        </app-input>
        <app-input label="证件类型">
          <input slot="input" v-model="applicant.holder_ID_type_name" type="text" readonly>
        </app-input>
        <app-input label="证件号码">
          <input slot="input" v-model="applicant.holder_ID_no" type="text" readonly>
        </app-input>
        <app-input label="证件有效期">
          <input slot="input" v-model="applicant.holder_ID_expire_end" type="text" readonly>
        </app-input>
        <app-input label="性别" class="am-list-control-button">
          <button slot="button" class="am-button tiny tiny-blue" disabled>{{applicant.holder_gender === 'LAB0009' ? '男' : '女'}}</button>
        </app-input>
        <app-input label="出生日期">
          <input slot="input" v-model="applicant.holder_birthday" type="text" readonly>
        </app-input>
        <app-input label="个人税收居民身份类型" v-if="getAge(applicant.birthday) >= 16">
          <input slot="input" v-model="applicant.holder_isTaxResidents" type="text" readonly>
        </app-input>
        <app-input label="国籍">
          <input slot="input" v-model="applicant.holder_nation_name" type="text" readonly>
        </app-input>
        <app-input label="户籍">
          <input slot="input" readonly :value="applicant.holder_home_province_name" type="text">
        </app-input>
        <app-input label="通讯地址">
          <input slot="input" readonly :value="applicant.holder_contact_province_name" type="text">
        </app-input>
        <app-input label="详细地址">
          <input slot="input" readonly :value="applicant.holder_contact_address" type="text">
        </app-input>
        <app-input label="邮编">
          <input slot="input" readonly :value="applicant.holder_contact_zip" type="text">
        </app-input>
        <app-input label="手机号码">
          <input slot="input" readonly :value="applicant.holder_mobile" type="text">
        </app-input>
        <app-input label="固定电话" v-show="applicant.holder_phone">
          <input slot="input" readonly :value="applicant.holder_phone" type="text">
        </app-input>
        <app-input label="工作单位" v-show="applicant.holder_company">
          <input slot="input" readonly :value="applicant.holder_company" type="text">
        </app-input>
        <app-input label="年收入(万元)">
          <input slot="input" readonly :value="applicant.holder_salary_avg" type="text">
        </app-input>
        <app-input label="收入来源">
          <input slot="input" readonly :value="applicant.holder_salary_from_name" type="text">
        </app-input>
        <app-input label="收入来源(详情)" v-show="applicant.holder_salary_from === 'LAF0014'">
          <input slot="input" readonly :value="applicant.holder_salary_from_other" type="text">
        </app-input>
        <app-input label="身高(cm)">
          <input slot="input" readonly :value="applicant.holder_height" type="text">
        </app-input>
        <app-input label="体重(kg)">
          <input slot="input" readonly :value="applicant.holder_weight" type="text">
        </app-input>
        <app-input label="是被保险人的" class="am-list-control-button">
          <button slot="button" class="am-button tiny tiny-blue" disabled>{{applicant.is_assured | isAssuredFilter}}</button>
        </app-input>
        <app-input label="职业">
          <input slot="input" readonly :value="applicant.holder_job_name" type="text">
        </app-input>
        <app-input label="合同争议处理方式">
          <input slot="input" readonly :value="applicant.DisputedFlag === 'LBH0001' ? '诉讼' : '仲裁'" type="text">
        </app-input>
        <app-input label="仲裁委员会" v-show="applicant.DisputedFlag === 'LBH0002'">
          <input slot="input" readonly :value="applicant.ACName" type="text">
        </app-input>
      </div>
    </app-dropdown>

    <!--被保人信息-->
    <app-dropdown v-if="assured && applicant.is_assured !== 'LBK0001'">
      <template slot="header">
        <div class="am-list-label">被保人信息</div>
        <div class="am-list-content am-ft-right">
          <router-link to="/beinsured"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </template>
      <div class="am-list-body">
        <app-input label="姓名">
          <input slot="input" v-model="assured.insured_name" type="text" readonly>
        </app-input>
        <app-input label="证件类型">
          <input slot="input" v-model="assured.insured_ID_type_name" type="text" readonly>
        </app-input>
        <app-input label="证件号码">
          <input slot="input" v-model="assured.insured_ID_no" type="text" readonly>
        </app-input>
        <app-input label="证件有效期">
          <input slot="input" v-model="assured.insured_ID_expire_end" type="text" readonly>
        </app-input>
        <app-input label="性别" class="am-list-control-button">
          <button slot="button" class="am-button tiny tiny-blue" disabled>{{assured.insured_gender === 'LAB0009' ? '男' : '女'}}</button>
        </app-input>
        <app-input label="出生日期">
          <input slot="input" v-model="assured.insured_birthday" type="text" readonly>
        </app-input>
        <app-input label="个人税收居民身份类型" v-if="getAge(assured.birthday) >= 16">
          <input slot="input" v-model="assured.insured_isTaxResidents" type="text" readonly>
        </app-input>
        <app-input label="国籍">
          <input slot="input" v-model="assured.insured_nation_name" type="text" readonly>
        </app-input>
        <app-input label="户籍">
          <input slot="input" readonly :value="assured.insured_home_province_name" type="text">
        </app-input>
        <app-input label="通讯地址">
          <input slot="input" readonly :value="assured.insured_contact_province_name" type="text">
        </app-input>
        <app-input label="详细地址">
          <input slot="input" readonly :value="assured.insured_contact_address" type="text">
        </app-input>
        <app-input label="邮编">
          <input slot="input" readonly :value="assured.insured_contact_zip" type="text">
        </app-input>
        <app-input label="手机号码">
          <input slot="input" readonly :value="assured.insured_mobile" type="text">
        </app-input>
        <app-input label="工作单位" v-show="assured.insured_company">
          <input slot="input" readonly :value="assured.insured_company" type="text">
        </app-input>
        <app-input label="年收入(万元)">
          <input slot="input" readonly :value="assured.insured_salary_avg" type="text">
        </app-input>
        <app-input label="收入来源">
          <input slot="input" readonly :value="assured.insured_salary_from_name" type="text">
        </app-input>
        <app-input label="收入来源(详情)" v-show="assured.insured_salary_from === 'LAF0014'">
          <input slot="input" readonly :value="assured.insured_salary_from_other" type="text">
        </app-input>
        <app-input label="身高(cm)">
          <input slot="input" readonly :value="assured.insured_height" type="text">
        </app-input>
        <app-input label="体重(kg)">
          <input slot="input" readonly :value="assured.insured_weight" type="text">
        </app-input>
        <app-input label="职业">
          <input slot="input" readonly :value="assured.insured_job_name" type="text">
        </app-input>
      </div>
    </app-dropdown>
    <div class="am-list am-list-6lb form" v-else>
      <div class="app-list-header">被保人为本人</div>
    </div>
    <!--险种信息-->
    <app-dropdown v-if="insurances">
      <template slot="header">
        <div class="am-list-label">险种信息</div>
        <div class="am-list-content am-ft-right">
          <router-link to="/prospectus"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </template>
      <div class="am-list-body" v-for="item, index in insurances" :key="index">
        <app-input label="险种">
          <input slot="input" readonly v-model="item.name" type="text">
        </app-input>
        <app-input label="保障期间" class="am-list-control-button">
          <button slot="button" class="am-button tiny tiny-blue" disabled>{{item.safe_year | safeYearFilter}}</button>
        </app-input>
        <app-input label="缴费年限" class="am-list-control-button">
          <button slot="button" class="am-button tiny tiny-blue" disabled>{{item.pay_year | payYearFilter}}</button>
        </app-input>
        <app-input label="基本保额(元)">
          <input slot="input" readonly v-model="item.money" type="text">
        </app-input>
        <app-input label="年缴保费(元)">
          <input slot="input" readonly v-model="item.period_money" type="text">
        </app-input>
      </div>
    </app-dropdown>
    <!--受益人信息-->
    <app-dropdown v-if="beneficiaries" v-for="beneficiary, index in beneficiaries" :key="index">
      <template slot="header">
        <div class="am-list-label">身故受益人信息</div>
        <div class="am-list-content am-ft-right">
          <router-link to="/beneficiaries"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </template>
      <app-input label="姓名">
        <input slot="input" v-model="beneficiary.fullname" type="text" readonly>
      </app-input>
      <app-input label="证件类型">
        <input slot="input" v-model="beneficiary.ID_type_name" type="text" readonly>
      </app-input>
      <app-input label="证件号码">
        <input slot="input" v-model="beneficiary.ID_no" type="text" readonly>
      </app-input>
      <app-input label="证件有效期">
        <input slot="input" v-model="beneficiary.ID_expire_end" type="text" readonly>
      </app-input>
      <app-input label="性别" class="am-list-control-button">
        <button slot="button" class="am-button tiny tiny-blue" disabled>{{beneficiary.gender === 'LAB0009' ? '男' : '女'}}</button>
      </app-input>
      <app-input label="出生日期">
        <input slot="input" v-model="beneficiary.birthday" type="text" readonly>
      </app-input>
      <app-input label="受益顺序" class="am-list-control-button">
        <button slot="button" class="am-button tiny tiny-blue" disabled>{{beneficiary.sort_order}}</button>
      </app-input>
      <app-input label="受益份额(%)">
        <input slot="input" type="text" v-model="beneficiary.rate" readonly>
      </app-input>
      <template v-if="anti_money">
        <app-input label="国籍">
          <input slot="input" readonly v-model.trim="beneficiary.nation_name" type="text">
        </app-input>
        <app-input label="通讯地址">
          <input slot="input" readonly v-model.trim="beneficiary.province_name" type="text">
        </app-input>
        <app-input label="详细地址">
          <input slot="input" readonly v-model.trim="beneficiary.address" type="text">
        </app-input>
        <app-input label="邮编">
          <input slot="input" readonly v-model.number="beneficiary.zip" type="number">
        </app-input>
        <app-input label="手机号码" v-show="beneficiary.phone">
          <input slot="input" readonly v-model.number="beneficiary.phone" type="number">
        </app-input>
        <app-input label="固定电话" v-show="beneficiary.calTel">
          <input slot="input" readonly v-model="beneficiary.calTel" type="text">
        </app-input>
        <app-input label="职业">
          <input slot="input" readonly v-model="beneficiary.occupation" type="text">
        </app-input>
      </template>
    </app-dropdown>
    <div class="am-list am-list-6lb form" v-if="beneficiaries === undefined">
      <div class="app-list-header">法定受益人</div>
    </div>
    <!--健康告知-->
    <div class="am-list am-list-6lb form">
      <div class="am-list-body" style="padding: 0">
        <div class="am-list-item dropdown">
          <div class="am-list-dropdown-main">
            <div class="am-list-label">健康告知</div>
            <div class="am-list-content am-ft-right"><a href="#/healthinfo" class=""><span class="app-iconfont"></span>修改&nbsp;&nbsp;</a>
            </div>
            <div class="am-list-arrow">
              <span class="am-icon arrow"></span>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!--银行卡信息-->
    <app-dropdown v-if="bank">
      <template slot="header">
        <div class="am-list-label">交费信息</div>
        <div class="am-list-content am-ft-right">
          <router-link to="/billinfo"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </template>
        <div class="am-list-body">
          <app-input label="首/续期交费方式">
            <input slot="input" readonly value="银行转账">
          </app-input>
          <app-input label="户名">
            <input slot="input" readonly v-model="applicant.holder_name" type="text">
          </app-input>
          <app-input label="账户类型" class="am-list-control-button">
            <button slot="button" class="am-button tiny tiny-blue" disabled>{{bank.bank_type === 'LAU0004' ? '借记卡' : '存折'}}</button>
          </app-input>
          <app-input label="银行账号">
            <input slot="input" readonly v-model="bank.bank_no" type="text">
          </app-input>
          <app-input label="开户行">
            <input slot="input" readonly v-model="bank.temp_bank_name" type="text">
          </app-input>
          <app-input label="开户行所在地">
            <input slot="input" readonly v-model="bank.bank_area_name" type="text">
          </app-input>
        </div>
    </app-dropdown>

    <div class="am-list am-list-6lb form am-list-last">
      <div class="app-list-brief">
        投保人、被保险人已仔细阅知，理解投保提示、产品说明书（仅限于分红、万能、投资连结类保险）、及保险条款尤其是责任免除、解除合同等规定，并同意遵守。投保人、被保险人确认在电子投保中的告知均为如实告知，与之有关的各份问卷及文件、对体检医生的各项申明与陈述均属真实，并知晓上述信息将作为贵公司承保的依据。如有不如实告知，贵公司有权依法解除合同，并依法决定是否对合同解除前发生的保险事故承担保险责任。
      </div>
      <div class="app-agreement">
        <div class="am-checkbox mini argument">
          <input id="agree" type="checkbox" v-model="confirm">
          <span class="icon-check"></span>
          <label class="am-ft-md " for="agree">确认信息无误后，方可进行到下一步。</label>
        </div>
      </div>
    </div>

    <div class="am-button-group" role="group" aria-label="操作按钮组">
      <button type="button" class="am-button white"><router-link to="/billinfo">上一步</router-link></button>
      <button type="button" class="am-button blue" @click="push()">提交核保</button>
    </div>
  </section>
</template>
<script>
  // const qs = require('qs')
  import Api from '../api'
  import {
    mapState
  } from 'vuex'

  export default {
    name: 'preview',
    data () {
      return {
        // warData: null, //保单信息
        isDouble: false, //是否双主险
        confirm: false, //确认信息
        uploading: false, //正在提交
        done: false,
        delNum: 0
      }
    },
    activated () {
      this.$forceUpdate()
      this.isDouble = false
      for (let i in this.$store.state.insurances) {
        console.log(this.$store.state.insurances[i].safe_id)
        if (this.$store.state.insurances[i].code === '12E20010') {
          Api.getDoubleOrderid(res => {
            if (res.code) {
              this.isDouble = res.data
            } else {
              this.$toast.open('双主险投保单号请求失败', 'warn')
            }
          })
        }
      }
    },
    computed: {
      ...mapState([
        'init',
        'matters',
        'safegoods',
        'main_insurance'
      ]),
      applicant () {
        return Api.obj2json(this.$store.state.applicant)
      },
      assured () {
        return Api.obj2json(this.$store.state.assured)
      },
      bank () {
        return Api.obj2json(this.$store.state.bank)
      },
      beneficiaries () {
        return this.$store.state.beneficiaries
      },
      clientvalue () {
        return Api.obj2json(this.$store.state.clientvalue)
      },
      insurances () {
        return this.$store.state.insurances
      },
      anti_money () {
        return this.$store.state.anti_money
      },
      war_id () {
        return this.$store.state.war_id
      },
      user_id () {
        return this.$store.state.user_id
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
      },
      isAssuredFilter: function (value) {
        if (value === 'LBK0001') {
          return '本人'
        } else if (value === 'LBK0002') {
          return '父母'
        } else if (value === 'LBK0003') {
          return '子女'
        } else if (value === 'LBK0004') {
          return '配偶'
        } else if (value === 'LBK0005') {
          return '祖孙'
        } else if (value === 'LBK0006') {
          return '其他'
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      next()
    },
    methods: {
      push () {
        const vm = this
        if (vm.done === true) {
          vm.$toast.open('您已经提交过了', 'warn')
          return false
        }
        if (!vm.confirm) {
          vm.$toast.open('请先确认信息无误', 'warn')
          return false
        }
        if (vm.uploading) {
          return false
        }
        vm.uploading = true
        // vm.$toast.open('正在提交', 'loading')
        let pushdata = {}

        let war_id = vm.war_id || ''
        pushdata.id = war_id
        pushdata.supplier_id = 12
        pushdata.ins_area = '323' //深圳
        pushdata.sales_channel = '2'
        pushdata.is_first = '1'
        pushdata.user_id = vm.user_id
        //投保人信息
        let applfieldFilter = ['holder_ID_type_name', 'holder_nation_name', 'holder_salary_from_name', 'holder_home_province_name', 'holder_contact_province_name', 'holder_contact_city_name', 'temp_holder_job_code', 'holder_job_name', 'holder_isTaxResidents']
        for (let i in this.applicant) {
          if (applfieldFilter.indexOf(i) === -1) {
            pushdata[i] = this.applicant[i]
          }
        }
        //被保人信息
        var insured = {}
        insured.id = ''
        var assufieldFilter = ['insured_ID_type_name', 'addr_type', 'insured_isTaxResidents', 'insured_home_province_name', 'insured_nation_name', 'insured_contact_province_name', 'insured_contact_city_name', 'insured_contact_district_name', 'temp_insured_job_code', 'insured_job_name']
        for (var i in this.assured) {
          if (assufieldFilter.indexOf(i) === -1) {
            insured[i] = this.assured[i]
          }
        }
        insured.rel_holder_insured = this.applicant.is_assured
        pushdata.insured = insured
        //险种信息
        var content = []
        var totalfee = 0
        this.insurances.forEach(function (item) {
          let safeitem = {}
          safeitem.is_main = item.is_main ? '1' : '0' //是主险
          safeitem.product_id = item.safe_id
          safeitem.period_payment = item.pay_year
          safeitem.period_guanantee = item.safe_year
          safeitem.fee = item.period_money
          safeitem.amount = item.money
          safeitem.quantity = 1
          totalfee += Number(item.period_money)
          safeitem.extend_items = {
            autoApl: item.autoApl ? '1' : '0'
          }
          content.push(safeitem)
        })
        pushdata.total = totalfee.toFixed(2) //总保费
        pushdata.content = content

        //受益人信息
        if (!this.beneficiaries) {
          pushdata.is_legal_benefic = '1' //法定
        } else {
          pushdata.is_legal_benefic = '0'
          pushdata.beneficiary = this.beneficiaries
        }
        //银行信息
        let bankFilter = ['temp_bank_name', 'bank_province_name', 'bank_area_name', 'PayMode', 'ExPayMode']
        for (let i in this.bank) {
          if (bankFilter.indexOf(i) === -1) {
            pushdata[i] = this.bank[i]
          }
        }
        pushdata.bank_holder = this.applicant.holder_name
        //健康告知
        pushdata.matter = this.clientvalue
        let extend_items = {}
        extend_items.resident_type = this.applicant.resident_type
        extend_items.isTaxResidents = this.applicant.holder_isTaxResidents
        extend_items.isTaxResidentsInsured = this.assured.insured_isTaxResidents
        extend_items.DisputedFlag = this.applicant.DisputedFlag //合同争议处理方式
        extend_items.ACName = this.applicant.ACName
        extend_items.GetPolMode = this.insurances[0].GetPolMode //保单递送方式
        extend_items.PayMode = this.bank.PayMode //首期缴费方式
        extend_items.ExPayMode = this.bank.ExPayMode //续期缴费方式
        if (vm.isDouble) extend_items.double_main_risk = 'NB_05' //双主险
        pushdata.extend_items = extend_items
        if (vm.isDouble) pushdata.policy_no = vm.isDouble
        console.log(pushdata)
        vm.$toast.open('正在核保中', 'loading')

        if (!pushdata) return false
        if (war_id) {
          console.log('deleteItem')
          war_id && vm.deleteItem(war_id, '', 'content', pushdata)
          war_id && vm.deleteItem(war_id, '', 'beneficiary', pushdata)
          war_id && vm.deleteItem(war_id, '', 'matter_value', pushdata)
        } else {
          vm.save_ins(pushdata)
        }
      },
      deleteItem (war_id, itemId, type, pushdata) {
        Api.deleteItem(war_id, itemId, type, res => {
          if (res.code) {
            console.log('删除成功')
            this.delNum++
            console.log(this.delNum)
            if (this.delNum === 3) {
              this.save_ins(pushdata)
            }
          } else {
            this.$toast.open('保存失败', 'warn')
          }
        })
      },
      save_ins (pushdata) {
        let vm = this
        this.delNum = 0
        console.log('保存保单')
        Api.saveWarranty(JSON.stringify(pushdata), res => {
          console.log(res)
          vm.uploading = false
          let policy_id = res.data.policy_id
          this.$store.dispatch('setWarId', policy_id)
          if (res.code && policy_id) {
            Api.pushWarranty(policy_id, res => {
              console.log('核保')
              console.log(res)
              vm.$store.dispatch('setParam', {
                insured: res
              })
              if (res.code === '-1') {
                vm.paySuccess(policy_id)
              } else if (res.code === '1') {
                vm.payInterface(policy_id)
              } else {
                vm.$toast.open(res.msg ? res.msg : '核保失败', 'warn')
              }
            })
          } else {
            vm.$toast.open('保存保单失败，请重试', 'warn')
          }
        })
      },
      paySuccess (policy_id) {
        let vm = this
        console.log('人核支付')
        Api.insuredImg(policy_id, res => {
          console.log(res)
          if (res.code === '1') {
            Api.paySuccess(policy_id, res => {
              console.log(res)
              if (res.code === '1') {
                vm.$toast.open('人核成功')
                setTimeout(function () {
                  vm.done = true
                  vm.$router.push('/success')
                }, 2000)
              } else {
                setTimeout(function () {
                  vm.done = true
                  vm.$router.push('/payfail')
                }, 2000)
                vm.$toast.open('人核支付失败')
              }
            })
            this.clearStorage()
          } else {
            vm.$toast.open('上传影像失败，请重试！')
          }
        })
      },
      payInterface (policy_id) {
        let vm = this
        console.log('自核支付')
        Api.insuredImg(policy_id, res => {
          console.log(res)
          if (res.code === '1') {
            Api.payInterface(policy_id, res => {
              console.log(res)
              if (res.code === '1') {
                vm.$toast.open('自核成功')
                setTimeout(function () {
                  vm.done = true
                  vm.$router.push('/success')
                }, 2000)
              } else {
                vm.$toast.open('自核支付失败')
                setTimeout(function () {
                  vm.done = true
                  vm.$router.push('/payfail')
                }, 2000)
              }
            })
            this.clearStorage()
          } else {
            vm.$toast.open('上传影像失败，请重试！')
          }
        })
      }
    }
  }
</script>
