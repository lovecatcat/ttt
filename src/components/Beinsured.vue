<template>
  <section id="Beinsured">
    <div class="am-list am-list-6lb form" v-if="init&&init.tax_type">
      <div class="app-list-header">被保人声明（备注说明）</div>
      <div class="am-list-body" aria-labelledby="demo-cb-header-1">
        <label class="am-list-item check" v-for="(item,index) in init.tax_type">
          <div class="am-list-content">{{item.text}}</div>
          <div class="am-checkbox">
            <input type="radio" name="radio" :value="item.value" v-model="assured.insured_isTaxResidents">
            <span class="icon-check" aria-hidden="true"></span>
          </div>
        </label>

      </div>
    </div>
    <!---->
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">被保人 — 证件信息</div>
      <div class="am-list-body">
        <div class="am-list-item ">
          <div class="am-list-label">证件类型</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly v-model="assured.insured_ID_type_name" @click="toShow('ID')"
                   v-if="assured.insured_ID_type_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('ID')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <app-input label="证件号码">
          <input slot="input" v-model.trim.lazy="assured.insured_ID_no" type="text" placeholder="请输入"
                 class="uppercase" @change="IDValidate">
          <div slot="icon" v-show="assured.insured_ID_no !== ''" class="am-list-clear"
               @click="assured.insured_ID_no = ''"><i class="iconfont icon-chahao"></i></div>
        </app-input>
        <div class="am-list-item ">
          <div class="am-list-label">证件有效期</div>
          <div class="am-list-control" style="width: 70%">
            <input :class="{'has': assured.insured_ID_expire_end !== ''}" :readonly="longTerm" v-model="assured.insured_ID_expire_end" type="date" placeholder="请选择" @change="checkTerm('投保人',assured.insured_ID_expire_end)">
            <div class="am-list-clear" style="" :disabled="longTerm"><i class="iconfont icon-rili"></i></div>
          </div>
          <div  class="am-list-change orange" :class="{'changeBlue' : longTerm}" @click="longTerm=!longTerm,toblur()">
            长期有效
          </div>
        </div>
      </div>
    </div>
    <!---->
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">被保人 — 身份信息</div>
      <div class="am-list-body">
        <app-input label="姓名">
          <input slot="input" v-model.lazy.trim="assured.insured_name" type="text" placeholder="请输入" @change="checkName">
          <div slot="icon" v-show="assured.insured_name !== ''" class="am-list-clear"><i class="iconfont icon-chahao"
                                                                                         @click="assured.insured_name = ''"></i>
          </div>
        </app-input>
        <app-input label="性别" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':assured.insured_gender===item.value}"
                  v-for="(item,index) in init.gender" :disabled="assured.insured_ID_type === 'LAA0028' || assured.insured_ID_type === 'LAA0031'"
                  @click="assured.insured_gender = item.value">{{item.text}}
          </button>
        </app-input>
        <!-- 证件为身份证和户口本 性别和 出生日期 不允许修改 -->
        <app-input label="出生日期">
          <input slot="input" @change="checkAge" :class="{'has': assured.insured_birthday !== ''}" :readonly="assured.insured_ID_type === 'LAA0028' || assured.insured_ID_type === 'LAA0031'" v-model="assured.insured_birthday" type="date" placeholder="请选择">
          <div slot="icon" v-if="assured.insured_ID_type !== 'LAA0028' || assured.insured_ID_type !== 'LAA0031'" v-show="assured.insured_birthday" class="am-list-clear"><i class="iconfont icon-chahao" @click="assured.insured_birthday = ''"></i></div>
        </app-input>
        <!-- 证件为护照时 可以修改国籍 -->
        <div class="am-list-item " v-if="assured.insured_ID_type === 'LAA0029'">
          <div class="am-list-label">国籍</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly v-model="assured.insured_nation_name"
                   @click="toShow('nation')" v-if="assured.insured_nation_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('nation')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <app-input label="国籍" v-else>
          <div slot="input" readonly>中国</div>
        </app-input>
        <!--户籍-->
        <div class="am-list-item "
             v-if="assured.insured_ID_type !== 'LAA0031' && assured.insured_ID_type !== 'LAA0028'">
          <div class="am-list-label">户籍</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly v-model="assured.insured_home_province_name"
                   @click="toShow('province')" v-if="assured.insured_home_province_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('province')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <app-input label="户籍" v-else>
          <input slot="input" type="text" v-model.lazy="assured.insured_home_province_name" placeholder="请选择" readonly>
        </app-input>
        <!--户籍-->
        <!--婚姻状况-->
        <app-input label="婚姻状态" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':assured.insured_marriage===item.value}"
                  v-for="(item,index) in init.marriage"
                  @click="assured.insured_marriage = item.value, toblur()">{{item.text}}
          </button>
        </app-input>
        <!--婚姻状况-->
        <!--手机号码-->
        <app-input label="手机号码">
          <input slot="input" @change="checkPhone" v-model.lazy="assured.insured_mobile" type="tel" placeholder="请输入">
          <div slot="icon" v-show="assured.insured_mobile !== ''" class="am-list-clear"><i class="iconfont icon-chahao"
                                                                                           @click="assured.insured_mobile = ''"></i>
          </div>
        </app-input>
        <!--手机号码-->
        <app-input label="邮箱">
          <input slot="input" @change="checkEmail" v-model.lazy="assured.insured_email" type="text" placeholder="请输入">
          <div slot="icon" v-show="assured.insured_email !== ''" class="am-list-clear"><i class="iconfont icon-chahao"
                                                                                          @click="assured.insured_email = ''"></i>
          </div>
        </app-input>
        <app-input label="职业">
          <div slot="input" @click="$refs.occupation.OccupationShow = true" placeholder="请点击选择职业" :class="{pd:!assured.insured_job_name}">
            {{assured.insured_job_name}}
          </div>
          <!--<div slot="icon" class="am-list-clear" v-show="assured.insured_job_name" ><i class="iconfont icon-chahao" @click="clearOccupation"></i></div>-->
        </app-input>

        <app-input label="工作单位">
          <input slot="input" v-model.lazy.trim="assured.insured_company" type="text" placeholder="请输入(选填)">
          <div slot="icon" v-show="assured.insured_company !== ''" class="am-list-clear"><i
            class="iconfont icon-chahao" @click="assured.insured_company = ''"></i></div>
        </app-input>
        <app-input label="年收入(万元)">
          <input slot="input"
                 @change="assured.insured_salary_avg >= 1000000 ? ($toast.open('数值超出范围，请确认单位为万元','warn'), assured.insured_salary_avg=''):''"
                 v-model.number.lazy="assured.insured_salary_avg" type="tel" placeholder="请输入">
          <div slot="icon" v-show="assured.insured_salary_avg !== ''" class="am-list-clear"><i
            class="iconfont icon-chahao" @click="assured.insured_salary_avg = ''"></i></div>
        </app-input>
        <!--收入来源-->
        <div class="am-list-item ">
          <div class="am-list-label">收入来源</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly v-model="assured.insured_salary_from_name"
                   @click="toShow('salary')" v-if="assured.insured_salary_from_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('salary')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <!--//	选择“其他”时，须填写具体的信息。	选择“其他”时，须填写具体的信息。-->
        <app-input label="" v-show="assured.insured_salary_from === 'LAF0014'">
          <input slot="input" v-model.lazy="assured.insured_salary_from_other" type="text" placeholder="收入来源具体信息">
          <div slot="icon" v-show="assured.insured_salary_from_other !== ''" class="am-list-clear"><i class="iconfont icon-chahao" @click="assured.insured_salary_from_other = ''"></i></div>
        </app-input>
        <!--收入来源-->
        <app-input label="身高(cm)">
          <input slot="input" v-model.number.lazy="assured.insured_height" type="tel" placeholder="请输入" @change="checkHeight">
          <div slot="icon" v-show="assured.insured_height !== ''" class="am-list-clear">
            <i class="iconfont icon-chahao" @click="assured.insured_height = ''"></i>
          </div>
        </app-input>
        <app-input label="体重(kg)">
          <input slot="input" v-model.number.lazy="assured.insured_weight" type="tel" placeholder="请输入" @change="checkWeight">
          <div slot="icon" v-show="assured.insured_weight !== ''" class="am-list-clear"><i class="iconfont icon-chahao"
                                                                                           @click="assured.insured_weight = ''"></i>
          </div>
        </app-input>
      </div>
    </div>
    <!---->
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">被保人 — 地址信息</div>
      <div class="am-list-body" aria-labelledby="demo-cb-header-1">
        <div class="am-list-item ">
          <div class="am-list-label">通讯地址</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly
                   v-model="assured.insured_contact_province_name + assured.insured_contact_city_name + assured.insured_contact_district_name"
                   @click="toShow('area')" v-if="assured.insured_contact_province_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('area')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <app-input label="详细地址">
          <input slot="input" v-model.lazy.trim="assured.insured_contact_address" type="text" placeholder="请输入">
          <div slot="icon" v-show="assured.insured_contact_address !== ''" class="am-list-clear"><i
            class="iconfont icon-chahao" @click="assured.insured_contact_address = ''"></i></div>
        </app-input>
        <app-input label="邮编">
          <input slot="input" @change="checkZipcode" maxlength="6" v-model.lazy="assured.insured_contact_zip"
                 type="text" placeholder="请输入" readonly>
          <div slot="icon" v-show="assured.insured_contact_zip !== ''" class="am-list-clear"><i
            class="iconfont icon-chahao" @click="assured.insured_contact_zip = ''"></i></div>
        </app-input>

      </div>
    </div>
    <!---->

    <div class="am-list am-list-6lb form am-list-last">
      <div class="am-list-switch">是否以参加当地社会基本医疗保险（或公费医疗）?</div>
      <div class="am-switch">
        <input type="checkbox" name="s1" class="am-switch-checkbox" checked="checked" v-model="assured.has_insured_SSID" :true-value="'LAG0005'" :false-value="'LAG0006'">
        <label class="am-switch-label" for="demo-s-1">
          <div class="am-switch-inner"></div>
          <div class="am-switch-switch"></div>
        </label>
      </div>
    </div>
    <div class="am-button-group" role="group" aria-label="操作按钮组">
      <button type="button" class="am-button white"><router-link to="/insured">上一步</router-link></button>
      <button type="button" class="am-button blue" @click="next()">下一步</button>
    </div>
    <!--vue-pickers-->
    <vue-pickers :show="show" :link="link" :columns="columns" :selectData="pickData" @cancel="close"
                 @confirm="confirmFn"></vue-pickers>
    <app-occupation ref="occupation"></app-occupation>
  </section>
</template>
<script>
  import Validator from '../widgets/IDValidator'
  import Api from '../api'
  // 区域选择器
  import Occupation from './Occupation'
  import vuePickers from 'vue-pickers'
  import {provs_data, citys_data, dists_data} from 'vue-pickers/lib/areaData'

  // import $_GET from '../widgets/Get'
  // const qs = require('qs')

  export default {
    name: 'Beinsured',
    components: {
      'app-occupation': Occupation,
      vuePickers
    },
    data() {
      return {
        longTerm: false, //是否长期有效
        cardinfo: {}, //身份证信息
        age: '',
        // 被保人信息
        assured: {
          insured_name: '', //姓名
          insured_ID_type: 'LAA0028', //证件类型
          insured_ID_type_name: '身份证', //证件类型名
          insured_ID_no: '', //证件号码
          insured_birthday: '', //出生日期
          insured_ID_expire_end: '', //证件有效期
          insured_gender: 'LAB0009', //性别  1男  2女
          insured_mobile: '',//手机号
          insured_email: '',//邮箱
          insured_height: '',//身高
          insured_weight: '',//体重
          insured_nation: 'LAI0002',//国籍
          insured_nation_name: '中国',//国籍
          insured_company: '',//工作单位
          insured_salary_from: '',//收入来源
          insured_salary_from_name: '',//收入来源名
          insured_salary_from_other: '', //选其他需填
          insured_salary_avg: '',//年收入

          addr_type: false,//是否所有地址同投保人,
          insured_home_province_name: '', //户籍（省）
          insured_home_province: '',//户籍【省】

          insured_contact_province: '', //现在住址【省】
          insured_contact_province_name: '', //现在住址【省】
          insured_contact_city: '', //现在住址【市】
          insured_contact_city_name: '', //现在住址【市】
          insured_contact_district: '', //现在住址【区】
          insured_contact_district_name: '', //现在住址【区】名称
          insured_contact_address: '', //现在住址【地址详情】
          insured_contact_zip: '',//现在住址【邮编】

          has_insured_SSID: 'LAG0005',//是否有社保
          insured_marriage: '',//婚姻状况
          insured_job_code: {},//职业
          temp_insured_job_code: '',//职业代码
          insured_job_name: '',//职业名称
          insured_isTaxResidents: '' //税收标识
        },
        isCopy: '',
        res: null,
        show: false,
        columns: 1,
        link: true,
        pickData: {
          data1: provs_data,
          data2: citys_data,
          data3: dists_data
        },
        resSelect: null
      }
    },
    computed: {
      init() {
        return this.$store.state.init || {}
      },
      appl_id() {
        return this.$store.state.assured.appl_id || ''
      }
    },
    mounted() {
      var vm = this
      vm.$nextTick(function () {
        vm.Interval = setInterval(vm.keepData, 5000)
      })
    },
    watch: {
      longTerm(val) {
        this.assured.insured_ID_expire_end = val ? '9999-12-31' : ''
      }
    },
    created() {
      // this.$watch('assured.insured_isTaxResidents', function (val) {
      //   if (val && val !== 'LAH0004') {
      //     this.$toast.open('根据您声明的内容，请选择线下投保并提交相关资料')
      //     return false
      //   }
      // })
    },
    methods: {
      close() {
        console.log(123)
        this.show = false
      },
      confirmFn(val) {
        console.log(val)
        this.show = false
        // this.res = val
        // this.defaultData = [val.select1]
        if (this.resSelect === 'ID') {
          this.assured.insured_ID_type = val.select1.value
          this.assured.insured_ID_type_name = val.select1.text
          this.pickData.data1 = []
          this.typeChange()
          this.clearRegister()
        } else if (this.resSelect === 'nation') {
          this.assured.insured_nation = val.select1.value
          this.assured.insured_nation_name = val.select1.text
          this.pickData.data1 = []
        } else if (this.resSelect === 'province') {
          this.assured.insured_home_province = val.select1.value
          this.assured.insured_home_province_name = val.select1.text
          this.pickData.data1 = []
          this.register_selected()
        } else if (this.resSelect === 'salary') {
          this.assured.insured_salary_from = val.select1.value
          this.assured.insured_salary_from_name = val.select1.text
          this.pickData.data1 = []
        } else if (this.resSelect === 'area') {
          this.assured.insured_contact_province = val.select1.value ? val.select1.value : ''
          this.assured.insured_contact_province_name = val.select1.text ? val.select1.text : ''
          this.assured.insured_contact_city = val.select2.value ? val.select2.value : ''
          this.assured.insured_contact_city_name = val.select2.text ? val.select2.text : ''
          this.assured.insured_contact_district = val.select3.value ? val.select3.value : ''
          this.assured.insured_contact_district_name = val.select3.text ? val.select3.text : ''
          this.assured.insured_contact_zip = val.select3.zipCode ? val.select3.zipCode : val.select2.zipCode
        }
      },
      toShow(type) {
        document.activeElement.blur()
        this.columns = 1
        this.link = false
        if (type === 'nation') {
          this.resSelect = 'nation'
          this.pickData.data1 = this.init.nation
        } else if (type === 'ID') {
          this.resSelect = 'ID'
          this.pickData.data1 = this.init.ID_type
        } else if (type === 'province') {
          this.resSelect = 'province'
          this.pickData.data1 = this.init.province
        } else if (type === 'salary') {
          this.resSelect = 'salary'
          this.pickData.data1 = this.init.annual_source
        } else if (type === 'area') {
          this.columns = 3
          this.link = true
          this.resSelect = 'area'
          this.pickData.data1 = provs_data
          this.pickData.data2 = citys_data
          this.pickData.data3 = dists_data
        }
        this.show = true
      },
      //失去焦点
      toblur() {
        document.activeElement.blur()
      },
      typeChange() {
        this.assured.insured_ID_no = ''
        this.assured.insured_home_province = ''
        this.assured.insured_home_province_name = ''
        this.assured.insured_nation = 'LAI0002' //国籍
        this.assured.insured_nation_name = '中国' //国籍
      },
      // 检查ID是否有效
      IDValidate() {
        const vm = this
        const type = vm.assured.insured_ID_type
        const id = vm.assured.insured_ID_no
        const owner = '被保人'
        let toast_text = null
        if (!type) {
          toast_text = owner + '证件类型不能为空'
        } else if (!id) {
          toast_text = owner + '证件号码不能为空'
        } else {
          switch (type) {
            case 'LAA0031': // 户口簿
            case 'LAA0028': // 身份证
              const addr = this.$store.state.addr

              // 不能为空
              if (!id) {
                toast_text = owner + '身份证号码不能为空'
              } else if (id.length !== 18) {
                toast_text = owner + '不符合身份证号码18位校验规则'
              } else if (!Validator.isValid(id, 18)) {
                toast_text = owner + '身份证号码不符合公安部校验规则，请确认!'
              } else {
                const idInfo = Validator.getInfo(id)
                const code = idInfo.addrCode.substr(0, 2)
                console.log(idInfo)
                const sex = { // 0为女，1为男
                  1: 'LAB0009',
                  0: 'LAB0010'
                }
                console.log(addr[code])
                vm.assured.insured_birthday = idInfo.birth
                vm.assured.insured_gender = sex[idInfo.sex]
                vm.assured.insured_home_province_name || (vm.assured.insured_home_province_name = addr[code].text)
                vm.assured.insured_home_province || (vm.assured.insured_home_province = addr[code].value)
              }
              break
            case 'LAA0029': // 护照
              if (id.length <= 3) {
                toast_text = owner + '护照必须是大于3位'
              }
              break
            case 'LAA0030': // 军官证
              if (id.length > 18 || id.length < 10) {
                toast_text = owner + '军官证必须是10-18位'
              }
              break
            case 'LAA0032': //港澳
              if (id.length <= 8) {
                toast_text = owner + '港澳居民来往内地通行证号码必须大于8位'
              }
              break
            case 'LAA0033': //台湾
              if (id.length < 8) {
                toast_text = owner + '台湾居民来往大陆通行证号码必须大于等于8位'
              }
              break
            case 'LAA0034': // 外国人身份证
              if (id.length !== 15) {
                toast_text = owner + '外国人永久居留身份证位为15位'
              } else if (!/^[a-z]{3}\d{12}$/gi.test(id)) {
                toast_text = owner + '外国人永久居留身份证号码不正确'
              }
              break
            default:
              break
          }
        }
        if (toast_text) {
          vm.$toast.open(toast_text, 'warn')
          return false
        }
        vm.assured.insured_ID_no = id.toUpperCase()
        return true
      },
      // 检查ID是否存在
      checkIDExist() {
        const vm = this
        const id = vm.assured.insured_ID_no
        Api.queryID(id, 'assured', res => {
          if (res.name && res.name.indexOf('Error') > -1) {
            vm.$toast.open('服务器开小差了', 'error')
            return
          }

          // 不存在 appl_id
          if (!res.appl_id && vm.assured.appl_id) {
            vm.$delete(vm.assured, 'appl_id')
            vm.cardinfo = {}
            return false
          }
          vm.cardinfo = res
          vm.$set(vm.assured, 'appl_id', res.appl_id)
          vm.setInfo()
        })
      },
      setInfo() {
        // let toast_text = Rule.checkName('投保人', this.assured.insured_name)
        // if (toast_text) {
        //   this.$toast.open(toast_text)
        // }
        // var vm = this
        // var res = vm.cardinfo
        //
        // // 是否同人
        // if (vm.assured.name !== res.name || vm.assured.document_number !== res.document_number || vm.assured.birthday !== res.birthday) {
        //   return
        // }
        // var assured = {}
        //
        // assured.annual_earnings = Number(res.annual_earnings)
        // assured.document_term = res.document_term
        // assured.height = res.height
        // assured.weight = res.weight
        // assured.name = res.name
        // assured.register = res.register
        // assured.tel = res.tel
        // assured.visit_tel = res.visit_tel
        // assured.work_unit = res.work_unit
        // assured.zipcode = res.zipcode
        // if (res.document_term === '9999-12-30') vm.longTerm = true
        // vm.assured = Object.assign(vm.assured, assured)
      },
      //姓名校验
      checkName () {
        let toast_text = null
        let strLength = 0
        let name = this.assured.insured_name
        const owner = '被保人'
        if (name) {
          for (let i = 0; i < name.length; i++) {
            if ((name.charCodeAt(i) < 0) || (name.charCodeAt(i) > 255)) {
              strLength = strLength + 3
            } else {
              strLength = strLength + 1
            }
          }
        }
        // console.log('校验名字' + owner + name + strLength)
        if (!name) {
          toast_text = owner + '姓名不能为空'
        } else if (strLength > 20) {
          toast_text = owner + '姓名长度不能超过20字符'
        } else if (/[a-z]/i.test(name)) { // 英文
          if (name.replace(/\s/, '').length < 3) {
            toast_text = owner + '姓名不小于3个字符'
          } else if (!/^[a-z]+[a-z\s]*[a-z]+$/i.test(name) || /(\s)\1/.test(name)) {
            toast_text = owner + '姓名填写有误'
          }
        } else if (/[\u4e00-\u9fa5·]/i.test(name)) { // 中文
          if (name.length < 2) {
            toast_text = owner + '姓名不小于2个汉字'
          } else if (!/^[\u4e00-\u9fa5]+[\u4e00-\u9fa5·]*[\u4e00-\u9fa5]+$/i.test(name) || /(·)\1/.test(name)) {
            toast_text = owner + '姓名填写有误'
          }
        } else if (!/^[a-z]+[\sa-z]*[a-z]+$/i.test(name) && !/^[\u4e00-\u9fa5]+[\u4e00-\u9fa5·]*[\u4e00-\u9fa5]+$/i.test(name)) { //中英文
          toast_text = owner + '姓名填写有误'
        }
        if (toast_text) {
          console.info(toast_text)
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return true
      },
      // 年龄验证
      checkAge() {
        let toastText = null
        this.age = this.getAge(this.assured.insured_birthday)
        if (this.age > 60) {
          toastText = '被保人年龄不能超过60周岁'
        } else if ((new Date() - new Date(this.assured.insured_birthday)) / 24 / 3600 / 1000 < 28) {
          toastText = '被保人需出生满28天'
        }
        if (toastText) {
          console.info(toastText)
          this.$toast.open(toastText, 'warn')
          return false
        }
        return true
      },
      //性别校验
      checkSex() {
        console.log('更改被保人性别')
        if (this.$store.state.applicant.is_assured === 'LBK0004' &&
          Number(this.$store.state.applicant.holder_gender) === Number(this.assured.insured_gender)) {
          let toast_text = '当投被保人关系为配偶时，性别不能相同'
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return true
      },
      //身高验证
      checkHeight () {
        const height = this.assured.insured_height
        const owner = '投保人'
        if (!height) {
          this.$toast.open('请录入' + owner + '身高', 'warn')
          return false
        } else if (!/^\d{2,3}$/g.test(height)) {
          this.assured.insured_height = ''
          this.$toast.open(owner + '身高请保留整数,长度2-3位', 'warn')
          return false
        }
        return true
      },
      //校验体重
      checkWeight() {
        const weight = this.assured.insured_weight
        const str = weight.toString()
        const owner = '投保人'
        if (!weight) {
          this.$toast.open('请录入' + owner + '体重', 'warn')
          return false
        } else if (str.indexOf('.') > -1 && !/^[0-9]+(\.[0-9]{2})?$/.test(weight)) {
          this.$toast.open(owner + '体重请保留2位小数', 'warn')
          return false
        } else if (str.length > 3 && str.indexOf('.') === -1) {
          this.assured.insured_weight = ''
          this.$toast.open(owner + '体重超出范围', 'warn')
          return false
        }
        return true
      },
      // 户籍选择
      register_selected() {
        let toast_text = null
        if (this.assured.insured_ID_type === 'LAA0032' && [33, 34].indexOf(this.assured.insured_home_province) === -1) {
          toast_text = '证件类型为港澳居民来往内地通行证时，户籍必须是香港或澳门'
        } else if (this.assured.insured_ID_type === 'LAA0033' && this.assured.insured_home_province !== 32) {
          toast_text = '证件类型为台湾居民来往大陆通行证时，户籍必须是台湾'
        } else if (['LAA0028', 'LAA0030', 'LAA0031'].indexOf(this.assured.insured_ID_type) > -1 && [32, 33, 34].indexOf(this.assured.insured_home_province) > -1) {
          toast_text = '证件类型为身份证、户口簿或军官证时，户籍不能是香港、澳门或台湾'
        }
        if (toast_text) {
          console.info(toast_text)
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return true
      },
      // 清除户籍
      clearRegister() {
        this.assured.insured_home_province = ''
        this.assured.insured_home_province_name = ''
      },
      // 邮编校验
      checkZipcode() {
        var zipcode = this.assured.insured_contact_zip
        var toast_text = null
        if (!zipcode) {
          toast_text = '邮编不能为空'
        } else if (!/^[0-9]{6}$/.test(zipcode)) {
          toast_text = '请输入6位数字邮编'
        }
        if (toast_text) {
          console.info(toast_text)
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return true
      },
      // 手机校验
      checkPhone() {
        const tel = this.assured.insured_mobile
        const owner = '被保人'
        var toast_text = null
        if (!tel) {
          toast_text = owner + '手机号不能为空'
        } else if (this.assured.insured_ID_type === 'LAA0032') {
          if (!/^1[3-9][0-9]{9}$|^00852[0-9]{8}$/.test(tel)) {
            toast_text = owner + '请输入正确的11位或13位手机号'
          }
        } else if (!/^1[3-9][0-9]{9}$/.test(tel)) {
          toast_text = owner + '手机号码不符合正常号码的校验规则'
        } else if (/^1[3-9][0-9](\d)\1{7}$/.test(tel)) {
          toast_text = owner + '手机号码录入有误'
        }
        if (toast_text) {
          console.info(toast_text)
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return true
      },
      //邮箱校验
      checkEmail() {
        const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        const vm = this
        const owner = '被保人'
        let toast_text = null
        if (!vm.assured.insured_email) {
          toast_text = owner + '邮箱不能为空'
        } else if (!reg.test(vm.assured.insured_email)) {
          toast_text = owner + '邮箱格式不正确'
        }
        if (toast_text) {
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return true
      },
      // 设置职业
      setOccupation(selected) {
        this.assured.insured_job_code = {
          '1': selected.value[0],
          '2': selected.value[1],
          '3': selected.value[2],
          '4': selected.value[3]
        }
        this.assured.temp_insured_job_code = selected.value[3]
        this.assured.insured_job_name = selected.text
      },
      // 清除职业
      clearOccupation() {
        this.warranty.appl_occupation_code = ''
        this.assured.occupation = ''
        this.$refs.occupation.show = true
      },
      // 校验表单
      checkForm() {
        const vm = this
        var toast_text = null
        if (!vm.IDValidate()) {
          return false
        } else if (!vm.checkName()) {
          return false
        } else if (vm.longTerm === false && !vm.checkTerm('被保人', vm.assured.insured_ID_expire_end)) {
          return false
        } else if (!vm.assured.insured_birthday) {
          toast_text = '请选择被保人【出生日期】'
        } else if (!vm.checkAge()) {
          return false
        } else if (!vm.assured.insured_isTaxResidents && vm.getAge(vm.assured.insured_birthday) >= 16) {
          toast_text = '请选择被保人个人税收居民身份类型'
        } else if (vm.getAge(vm.assured.insured_birthday) >= 16 && !vm.checkTax('被保人', vm.assured.insured_isTaxResidents)) {
          return false
        } else if (!vm.assured.insured_nation) {
          toast_text = '请选择被保人【国籍】'
        } else if (!vm.assured.insured_home_province && vm.assured.insured_ID_type !== 'LAA0031' && vm.assured.insured_ID_type !== 'LAA0028') {
          toast_text = '请选择被保人【户籍】'
        } else if (!vm.checkPhone()) {
          return false
        } else if (!vm.assured.insured_salary_avg) {
          toast_text = '请填写被保人【年收入】'
        } else if (!vm.assured.insured_salary_from) {
          toast_text = '请选择被保人【收入来源】'
        } else if (vm.assured.insured_salary_from === 'LAF0014' && !vm.assured.insured_salary_from_other) {
          toast_text = '请填写被保人【收入来源具体信息】'
        } else if (!vm.assured.insured_height) {
          toast_text = '请填写被保人【身高】'
        } else if (!vm.assured.insured_weight) {
          toast_text = '请填写被保人【体重】'
        } else if (!vm.assured.temp_insured_job_code) {
          toast_text = '请选择被保人【职业】'
        } else if (!vm.assured.insured_contact_province) {
          toast_text = '请选择被保人【通讯地址省份】'
        } else if (!vm.assured.insured_contact_city && vm.assured.province !== '35') {
          toast_text = '请选择被保人【通讯地址市区】'
        } else if (!vm.assured.insured_contact_address) {
          toast_text = '请填写被保人【详细地址】'
        } else if (!vm.checkZipcode()) {
          return false
        }
        if (toast_text) {
          console.info(toast_text)
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return true
      },
      next() {
        if (!this.checkForm()) {
          return false
        }
        this.$toast.close()
        clearInterval(this.Interval)
        this.$store.commit('saveAssured', this.assured)
        this.$router.push('/prospectus')
      }
    }
  }
</script>
<style>
  input[type="date"]:before,
  input[type="month"]:before {
    color: #c8c8c8;
    content: attr(placeholder);
  }

  input[type="date"].has:before,
  input[type="month"].has:before {
    content: "" !important;
  }

  .pd:before {
    color: #c8c8c8;
    content: attr(placeholder);
  }

  .pd {
    -webkit-user-select: none;
  }
</style>
