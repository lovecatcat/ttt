<template>
  <section id="Insured" class="pd-b47">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">投保人声明（备注说明）</div>
      <div class="am-list-body" aria-labelledby="demo-cb-header-1">
        <label class="am-list-item check" v-for="(item,index) in init.tax_type">
          <div class="am-list-content">{{item.text}}</div>
          <div class="am-checkbox">
            <input type="radio" name="radio" :value="item.value" v-model="applicant.holder_isTaxResidents">
            <span class="icon-check" aria-hidden="true"></span>
          </div>
        </label>

      </div>
    </div>
    <!---->
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">投保人 — 证件信息</div>
      <div class="am-list-body">
        <div class="am-list-item ">
          <div class="am-list-label">证件类型</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly v-model="applicant.holder_ID_type_name" @click="toShow('ID')"
                   v-if="applicant.holder_ID_type_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('ID')"  v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <app-input label="证件号码">
          <input slot="input" v-model.trim.lazy="applicant.holder_ID_no" type="text" placeholder="请输入"
                 class="uppercase" @change="IDValidate">
          <div slot="icon" v-show="applicant.holder_ID_no !== ''" class="am-list-clear"
               @click="applicant.holder_ID_no = ''"><i class="iconfont icon-chahao"></i></div>
        </app-input>
        <div class="am-list-item ">
          <div class="am-list-label">证件有效期</div>
          <div class="am-list-control" style="width: 70%">
            <input :class="{'has': applicant.holder_ID_expire_end !== ''}" :readonly="longTerm" v-model="applicant.holder_ID_expire_end" type="date" placeholder="请选择" @change="checkTerm('投保人',applicant.holder_ID_expire_end)">
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
      <div class="app-list-header">投保人 — 身份信息</div>
      <div class="am-list-body">
        <app-input label="姓名">
          <input slot="input" v-model.lazy.trim="applicant.holder_name" type="text" placeholder="请输入" @change="checkName">
          <div slot="icon" v-show="applicant.holder_name !== ''" class="am-list-clear"><i class="iconfont icon-chahao"
                                                                                         @click="applicant.holder_name = ''"></i>
          </div>
        </app-input>
        <app-input label="性别" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':applicant.holder_gender===item.value}"
                  v-for="(item,index) in init.gender" :disabled="applicant.holder_ID_type === 'LAA0028' || applicant.holder_ID_type === 'LAA0031'"
                  @click="toblur(),applicant.holder_gender = item.value">{{item.text}}
          </button>
        </app-input>
        <!-- 证件为身份证和户口本 性别和 出生日期 不允许修改 -->
        <app-input label="出生日期">
          <input slot="input" @change="checkAge" :class="{'has': applicant.holder_birthday !== ''}" :readonly="applicant.holder_ID_type === 'LAA0028' || applicant.holder_ID_type === 'LAA0031'" v-model="applicant.holder_birthday" type="date" placeholder="请选择">
          <div slot="icon" v-if="applicant.holder_ID_type !== 'LAA0028' || applicant.holder_ID_type !== 'LAA0031'" v-show="applicant.holder_birthday" class="am-list-clear">
            <i class="iconfont icon-chahao" @click="applicant.holder_birthday = ''"></i>
          </div>
        </app-input>
        <!-- 证件为护照时 可以修改国籍 -->
        <div class="am-list-item " v-if="applicant.holder_ID_type === 'LAA0029'">
          <div class="am-list-label">国籍</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly v-model="applicant.holder_nation_name"
                   @click="toShow('nation')" v-if="applicant.holder_nation_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('nation')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <app-input label="国籍" v-else>
          <div slot="input" readonly>中国</div>
        </app-input>
        <!--户籍-->
        <div class="am-list-item ">
             <!--v-if="applicant.holder_ID_type !== 'LAA0031' && applicant.holder_ID_type !== 'LAA0028'">-->
          <div class="am-list-label">户籍</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly v-model="applicant.holder_home_province_name"
                   @click="toShow('province')" v-if="applicant.holder_home_province_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('province')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <!--<app-input label="户籍" v-else>-->
          <!--<input slot="input" type="text" v-model.lazy="applicant.holder_home_province_name" placeholder="请选择" readonly>-->
        <!--</app-input>-->
        <!--户籍-->
        <!--婚姻状况-->
        <app-input label="婚姻状态" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':applicant.holder_marriage===item.value}"
                  v-for="(item,index) in init.marriage"
                  @click="toblur(), applicant.holder_marriage = item.value">{{item.text}}
          </button>
        </app-input>
        <!--婚姻状况-->
        <!--手机号码-->
        <app-input label="手机号码">
          <input slot="input" @change="checkPhone" v-model.lazy="applicant.holder_mobile" type="tel" placeholder="请输入">
          <div slot="icon" v-show="applicant.holder_mobile !== ''" class="am-list-clear"><i class="iconfont icon-chahao"
                                                                                           @click="applicant.holder_mobile = ''"></i>
          </div>
        </app-input>
        <!--手机号码-->
        <app-input label="固定电话">
          <input slot="input" @change="checkTel" v-model.lazy.trim="applicant.holder_phone" type="tel"
                 placeholder="请输入(选填)">
          <div slot="icon" v-show="applicant.holder_phone !== ''" class="am-list-clear"><i class="iconfont icon-chahao"
                                                                                          @click="applicant.holder_phone = ''"></i>
          </div>
        </app-input>
        <!--邮箱-->
        <app-input label="邮箱">
          <input slot="input" @change="checkEmail" v-model.lazy.trim="applicant.holder_email" type="text"
                 placeholder="请输入">
          <div slot="icon" v-show="applicant.holder_email !== ''" class="am-list-clear"><i class="iconfont icon-chahao"
                                                                                           @click="applicant.holder_email = ''"></i>
          </div>
        </app-input>
        <app-input label="职业">
          <div slot="input" @click="$refs.occupation.OccupationShow = true, toblur(), scrollClose()" placeholder="请点击选择职业" :class="{pd:!applicant.holder_job_name}">
            {{applicant.holder_job_name}}
          </div>
          <!--<div slot="icon" class="am-list-clear" v-show="applicant.holder_job_name" ><i class="iconfont icon-chahao" @click="clearOccupation"></i></div>-->
        </app-input>

        <app-input label="工作单位">
          <input slot="input" v-model.lazy.trim="applicant.holder_company" type="text" placeholder="请输入(选填)">
          <div slot="icon" v-show="applicant.holder_company !== ''" class="am-list-clear"><i
            class="iconfont icon-chahao" @click="applicant.holder_company = ''"></i></div>
        </app-input>
        <app-input label="年收入(万元)">
          <input slot="input"
                 @change="applicant.holder_salary_avg >= 1000000 ? ($toast.open('数值超出范围，请确认单位为万元','warn'), applicant.holder_salary_avg=''):''"
                 v-model.number.lazy="applicant.holder_salary_avg" type="tel" placeholder="请输入">
          <div slot="icon" v-show="applicant.holder_salary_avg !== ''" class="am-list-clear"><i
            class="iconfont icon-chahao" @click="applicant.holder_salary_avg = ''"></i></div>
        </app-input>
        <!--收入来源-->
        <div class="am-list-item ">
          <div class="am-list-label">收入来源</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly v-model="applicant.holder_salary_from_name"
                   @click=" toShow('salary')" v-if="applicant.holder_salary_from_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('salary')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <!--//	选择“其他”时，须填写具体的信息。	选择“其他”时，须填写具体的信息。-->
        <app-input label="" v-show="applicant.holder_salary_from === 'LAF0014'">
          <input slot="input" v-model.lazy="applicant.holder_salary_from_other" type="text" placeholder="收入来源具体信息">
          <div slot="icon" v-show="applicant.holder_salary_from_other !== ''" class="am-list-clear"><i class="iconfont icon-chahao" @click="applicant.holder_salary_from_other = ''"></i></div>
        </app-input>
        <!--收入来源-->
        <app-input label="身高(cm)">
          <input slot="input" v-model.number.lazy="applicant.holder_height" type="tel" placeholder="请输入" @change="checkHeight">
          <div slot="icon" v-show="applicant.holder_height !== ''" class="am-list-clear">
            <i class="iconfont icon-chahao" @click="applicant.holder_height = ''"></i>
          </div>
        </app-input>
        <app-input label="体重(kg)">
          <input slot="input" v-model.number.lazy="applicant.holder_weight" type="tel" placeholder="请输入" @change="checkWeight">
          <div slot="icon" v-show="applicant.holder_weight !== ''" class="am-list-clear"><i class="iconfont icon-chahao"
                                                                                           @click="applicant.holder_weight = ''"></i>
          </div>
        </app-input>
      </div>
    </div>
    <!---->
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">投保人 — 地址信息</div>
      <div class="am-list-body" aria-labelledby="demo-cb-header-1">
        <div class="am-list-item ">
          <div class="am-list-label">通讯地址</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly
                   v-model="applicant.holder_contact_province_name + applicant.holder_contact_city_name + applicant.holder_contact_district_name"
                   @click="toShow('area')" v-if="applicant.holder_contact_province_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('area')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <app-input label="详细地址">
          <input slot="input" v-model.lazy.trim="applicant.holder_contact_address" type="text" placeholder="请输入">
          <div slot="icon" v-show="applicant.holder_contact_address != ''" class="am-list-clear"><i
            class="iconfont icon-chahao" @click="applicant.holder_contact_address = ''"></i></div>
        </app-input>
        <app-input label="邮编">
          <input slot="input" @change="checkZipcode" maxlength="6" v-model.lazy="applicant.holder_contact_zip"
                 type="text" placeholder="请输入" readonly>
          <div slot="icon" v-show="applicant.holder_contact_zip != ''" class="am-list-clear"><i
            class="iconfont icon-chahao" @click="applicant.holder_contact_zip = ''"></i></div>
        </app-input>

      </div>
    </div>
    <!---->
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">投保人 — 合同信息</div>
      <div class="am-list-body" aria-labelledby="demo-cb-header-1">
        <app-input label="是被保人的" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':applicant.is_assured===item.value}"
                  v-for="(item,index) in init.is_assured"
                  @click="toblur(), applicant.is_assured = item.value">{{item.text}}
          </button>
        </app-input>
        <app-input label="合同争议处理方式" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':applicant.DisputedFlag===item.value}"
                  v-for="(item,index) in init.DisputedFlag"
                  @click="toblur(), applicant.DisputedFlag = item.value">{{item.text}}
          </button>
        </app-input>
        <app-input label="仲裁委员会名称" v-if="applicant.DisputedFlag == 'LBH0002'">
          <input slot="input" v-model.lazy="applicant.ACName" type="text" placeholder="请输入">
          <div slot="icon" v-show="applicant.ACName != ''" class="am-list-clear"><i class="iconfont icon-chahao"
                                                                                    @click="applicant.ACName = ''"></i>
          </div>
        </app-input>

      </div>
    </div>
    <!---->
    <div class="am-list am-list-6lb form am-list-last">
        <div class="am-list-switch">是否以参加当地社会基本医疗保险（或公费医疗）?</div>
          <div class="am-switch">
            <input type="checkbox" name="s1" class="am-switch-checkbox" checked="checked" v-model="applicant.holder_has_SSID" :true-value="'LAG0005'" :false-value="'LAG0006'">
            <label class="am-switch-label" for="demo-s-1">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
    </div>
    <div class="am-button-group am-fixed am-fixed-bottom" role="group" aria-label="操作按钮组" v-show="group">
      <button type="button" class="am-button white"><router-link to="/">上一步</router-link></button>
      <button type="button" class="am-button blue" @click="next">下一步</button>
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
    name: 'Insured',
    components: {
      'app-occupation': Occupation,
      vuePickers
    },
    data() {
      return {
        longTerm: false, //是否长期有效
        cardinfo: {}, //身份证信息
        // 投保人信息
        applicant: {
          holder_name: '', //姓名
          holder_ID_type: 'LAA0028', //证件类型
          holder_ID_type_name: '身份证', //证件类型名
          holder_ID_no: '', //证件号码
          holder_birthday: '', //出生日期
          holder_ID_expire_end: '', //证件有效期
          holder_gender: 'LAB0009', //性别  1男  2女
          holder_mobile: '', //手机号
          holder_email: '', //邮箱
          holder_height: '', //身高
          holder_weight: '', //体重
          holder_nation: 'LAI0002', //国籍
          holder_nation_name: '中国', //国籍
          holder_company: '', //工作单位
          holder_salary_from: '', //收入来源
          holder_salary_from_name: '', //收入来源名
          holder_salary_from_other: '', //选其他需填
          holder_salary_avg: '', //年收入
          holder_phone: '', //固定电话
          holder_marriage: '', //婚姻状态

          is_assured: 'LBK0001', //投保人是被保人的

          holder_home_province: '', //户籍（省）
          holder_home_province_name: '', //户籍（省）
          holder_contact_province: '', //现在住址【省】
          holder_contact_province_name: '', //现在住址【省】
          holder_contact_city: '', //现在住址【市】
          holder_contact_city_name: '', //现在住址【市】
          holder_contact_district: '', //现在住址【区】
          holder_contact_district_name: '', //现在住址【区】名称
          holder_contact_address: '', //现在住址【地址详情】
          holder_contact_zip: '', //现在住址【邮编】

          holder_has_SSID: 'LAG0005', //是否有社保
          holder_job_code: {}, //职业
          temp_holder_job_code: '', //职业代码
          holder_job_name: '', //职业名称
          holder_isTaxResidents: '',//税收标识

          DisputedFlag: 'LBH0001', //合同争议处理方式
          ACName: ''
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
        resSelect: null,
        group: true, //底部按钮
        docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
        showHeight: document.documentElement.clientHeight   //实时屏幕高度
      }
    },
    computed: {
      init() {
        return this.$store.state.init || {}
      },
      appl_id() {
        return this.$store.state.applicant.appl_id || ''
      }
    },
    mounted() {
      var vm = this
      vm.$nextTick(function () {
        vm.Interval = setInterval(vm.keepData, 5000)
      })
      // window.onresize监听页面高度的变化
      window.onresize = () => {
        return (() => {
          this.showHeight = document.body.clientHeight
        })()
      }
    },
    watch: {
      longTerm(val) {
        this.applicant.holder_ID_expire_end = val ? '9999-12-31' : ''
      },
      appl_id(val) {
        if (val) {
          this.applicant.appl_id = val
        }
      },
      showHeight() { //底部按钮fixed兼容
        if (this.docmHeight > this.showHeight) {
          this.group = false
        } else {
          this.group = true
        }
      }
    },
    created() {
      // this.$watch('applicant.holder_isTaxResidents', function (val) {
      //   if (val && val !== 'LAH0004') {
      //     this.$toast.open('根据您声明的内容，请选择线下投保并提交相关资料')
      //     return false
      //   }
      // })
      this.$watch('applicant.is_assured', function (val) {
        if (val && val === 'LBK0002' && this.applicant.holder_marriage === 'LAD0005') {
          this.$toast.open('投保人未婚不能为被保人父母！', 'warn')
          this.applicant.is_assured = 'LBK0001'
          return false
        } else if (val && val === 'LBK0004' && this.applicant.holder_marriage === 'LAD0005') {
          this.$toast.open('投保人未婚不能为被保人配偶！', 'warn')
          this.applicant.is_assured = 'LBK0001'
          return false
        }
      })
      this.setData('applicant', this.$storage.fetch('applicant'))
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
        if (this.resSelect === 'ID') {
          this.applicant.holder_ID_type = val.select1.value
          this.applicant.holder_ID_type_name = val.select1.text
          this.pickData.data1 = []
          this.typeChange()
          this.clearRegister()
        } else if (this.resSelect === 'nation') {
          this.applicant.holder_nation = val.select1.value
          this.applicant.holder_nation_name = val.select1.text
          this.pickData.data1 = []
        } else if (this.resSelect === 'province') {
          this.applicant.holder_home_province = val.select1.value
          this.applicant.holder_home_province_name = val.select1.text
          this.pickData.data1 = []
          this.register_selected()
        } else if (this.resSelect === 'salary') {
          this.applicant.holder_salary_from = val.select1.value
          this.applicant.holder_salary_from_name = val.select1.text
          this.pickData.data1 = []
        } else if (this.resSelect === 'area') {
          this.applicant.holder_contact_province = val.select1.value ? val.select1.value : ''
          this.applicant.holder_contact_province_name = val.select1.text ? val.select1.text : ''
          this.applicant.holder_contact_city = val.select2.value ? val.select2.value : ''
          this.applicant.holder_contact_city_name = val.select2.text ? val.select2.text : ''
          this.applicant.holder_contact_district = val.select3.value ? val.select3.value : ''
          this.applicant.holder_contact_district_name = val.select3.text ? val.select3.text : ''
          this.applicant.holder_contact_zip = val.select3.zipCode ? val.select3.zipCode : val.select2.zipCode
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
          //解决省市区的bug，后2列的数据不重置
          this.pickData.data3 = []
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
      //禁用滚动条
      scrollClose() {
        document.documentElement.style.overflowY = 'hidden'
      },
      // keepData() {
      //   let keepData = {
      //     company: '信泰',
      //     applicant: this.applicant,
      //     assured: this.$store.state.assured,
      //     warranty: this.warranty,
      //     insurance: {},
      //     beneficiary: {}
      //   }
      //   keepData = Api.obj2json(keepData)
      //   let params = {}
      //   params['admin_id'] = $_GET['admin_id']
      //   params['json'] = JSON.stringify(keepData)
      //   Api.keepData(qs.stringify(params), res => {
      //     console.log(res)
      //   })
      // },
      typeChange() {
        this.applicant.holder_ID_no = ''
        this.applicant.holder_home_province = ''
        this.applicant.holder_home_province_name = ''
        this.applicant.holder_nation = 'LAI0002' //国籍
        this.applicant.holder_nation_name = '中国' //国籍
      },
      // 检查ID是否有效
      IDValidate() {
        const vm = this
        const type = vm.applicant.holder_ID_type
        const id = vm.applicant.holder_ID_no
        const owner = '投保人'
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
                console.log(code)
                vm.applicant.holder_birthday = idInfo.birth
                vm.checkAge()
                vm.applicant.holder_gender = sex[idInfo.sex]
                vm.applicant.holder_home_province_name || (vm.applicant.holder_home_province_name = addr[code].text)
                vm.applicant.holder_home_province || (vm.applicant.holder_home_province = addr[code].value)
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
        vm.applicant.holder_ID_no = id.toUpperCase()
        return true
      },
      // 检查ID是否存在
      // checkIDExist() {
      //   const vm = this
      //   const id = vm.applicant.holder_ID_no
      //   Api.queryID(id, 'applicant', res => {
      //     if (res.name && res.name.indexOf('Error') > -1) {
      //       vm.$toast.open('服务器开小差了', 'error')
      //       return
      //     }
      //
      //     // 不存在 appl_id
      //     if (!res.appl_id && vm.applicant.appl_id) {
      //       vm.$delete(vm.applicant, 'appl_id')
      //       vm.cardinfo = {}
      //       return false
      //     }
      //     vm.cardinfo = res
      //     vm.$set(vm.applicant, 'appl_id', res.appl_id)
      //     vm.setInfo()
      //   })
      // },
      setInfo() {
        // let toast_text = Rule.checkName('投保人', this.applicant.holder_name)
        // if (toast_text) {
        //   this.$toast.open(toast_text)
        // }
        // var vm = this
        // var res = vm.cardinfo
        //
        // // 是否同人
        // if (vm.applicant.name !== res.name || vm.applicant.document_number !== res.document_number || vm.applicant.birthday !== res.birthday) {
        //   return
        // }
        // var applicant = {}
        //
        // applicant.annual_earnings = Number(res.annual_earnings)
        // applicant.document_term = res.document_term
        // applicant.height = res.height
        // applicant.weight = res.weight
        // applicant.name = res.name
        // applicant.register = res.register
        // applicant.tel = res.tel
        // applicant.visit_tel = res.visit_tel
        // applicant.work_unit = res.work_unit
        // applicant.zipcode = res.zipcode
        // if (res.document_term === '9999-12-30') vm.longTerm = true
        // vm.applicant = Object.assign(vm.applicant, applicant)
      },
      //姓名校验
      checkName () {
        let toast_text = null
        let strLength = 0
        let name = this.applicant.holder_name
        const owner = '投保人'
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
        const age = this.getAge(this.applicant.holder_birthday)
        if (age <= 16) {
          this.$toast.open('投保人年龄不符合规定，请更换投保人', 'error')
          return false
        }
        if (age < 16) {
          this.applicant.holder_ID_type = ''
        }
        return true
      },
      //身高验证
      checkHeight () {
        const height = this.applicant.holder_height
        const owner = '投保人'
        if (!height) {
          this.$toast.open('请录入' + owner + '身高', 'warn')
          return false
        } else if (!/^\d{2,3}$/g.test(height)) {
          this.applicant.holder_height = ''
          this.$toast.open(owner + '身高请保留整数,长度2-3位', 'warn')
          return false
        }
        return true
      },
      //校验体重
      checkWeight() {
        const weight = this.applicant.holder_weight
        const str = weight.toString()
        const owner = '投保人'
        if (!weight) {
          this.$toast.open('请录入' + owner + '体重', 'warn')
          return false
        } else if (str.indexOf('.') > -1 && !/^[0-9]+(\.[0-9]{2})?$/.test(weight)) {
          this.$toast.open(owner + '体重请保留2位小数', 'warn')
          return false
        } else if (str.length > 3 && str.indexOf('.') === -1) {
          this.applicant.holder_weight = ''
          this.$toast.open(owner + '体重超出范围', 'warn')
          return false
        }
        return true
      },
      // 户籍选择
      register_selected(selected) {
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
        this.applicant.holder_home_province = ''
        this.applicant.holder_home_province_name = ''
      },
      // 邮编校验
      checkZipcode() {
        var zipcode = this.applicant.holder_contact_zip
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
        const tel = this.applicant.holder_mobile
        const owner = '投保人'
        var toast_text = null
        if (!tel) {
          toast_text = '请填写投保人【手机号码】'
        } else if (this.applicant.holder_ID_type === 'LAA0032') {
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
      // 电话校验
      checkTel() {
        if (!/^0\d{10,11}$/.test(this.applicant.holder_phone)) {
          this.$toast.open('电话以0开头,格式为区号+号码,如:01012345678', '')
        }
        return true
      },
      //邮箱校验
      checkEmail() {
        const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        const vm = this
        const owner = '投保人'
        let toast_text = null
        if (!vm.applicant.holder_email) {
          toast_text = '请填写投保人【邮箱】'
        } else if (!reg.test(vm.applicant.holder_email)) {
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
        this.applicant.holder_job_code = {
          '1': selected.value[0],
          '2': selected.value[1],
          '3': selected.value[2],
          '4': selected.value[3]
        }
        this.applicant.temp_holder_job_code = selected.value[3]
        this.applicant.holder_job_name = selected.text
      },
      // 清除职业
      clearOccupation() {
        this.warranty.appl_occupation_code = ''
        this.applicant.occupation = ''
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
        } else if (vm.longTerm === false && !vm.checkTerm('投保人', vm.applicant.holder_ID_expire_end)) {
          return false
        } else if (!vm.applicant.holder_birthday) {
          toast_text = '请选择投保人【出生日期】'
        } else if (!vm.checkAge()) {
          return false
        } else if (!vm.applicant.holder_isTaxResidents && vm.getAge(vm.applicant.holder_birthday) >= 16) {
          toast_text = '请选择投保人个人税收居民身份类型'
        } else if (vm.getAge(vm.applicant.holder_birthday) >= 16 && !vm.checkTax('投保人', vm.applicant.holder_isTaxResidents)) {
          return false
        } else if (!vm.applicant.holder_nation) {
          toast_text = '请选择投保人【国籍】'
        } else if (!vm.applicant.holder_home_province && vm.applicant.holder_ID_type !== 'LAA0031' && vm.applicant.holder_ID_type !== 'LAA0028') {
          toast_text = '请选择投保人【户籍】'
        } else if (!vm.applicant.holder_marriage) {
          toast_text = '请选择投保人【婚姻状态】'
        } else if (!vm.checkPhone()) {
          return false
        } else if (vm.applicant.holder_phone && !vm.checkTel()) {
          return false
        } else if (!vm.checkEmail()) {
          return false
        } else if (!vm.applicant.holder_salary_avg) {
          toast_text = '请填写投保人【年收入】'
        } else if (!vm.applicant.holder_salary_from) {
          toast_text = '请选择投保人【收入来源】'
        } else if (vm.applicant.holder_salary_from === 'LAF0014' && !vm.applicant.holder_salary_from_other) {
          toast_text = '请填写投保人【收入来源具体信息】'
        } else if (!vm.applicant.holder_height) {
          toast_text = '请填写投保人【身高】'
        } else if (!vm.applicant.holder_weight) {
          toast_text = '请填写投保人【体重】'
        } else if (!vm.applicant.temp_holder_job_code) {
          toast_text = '请选择投保人【职业】'
        } else if (!vm.applicant.holder_contact_province) {
          toast_text = '请选择投保人【通讯地址省份】'
        } else if (!vm.applicant.holder_contact_city && vm.applicant.province !== '35') {
          toast_text = '请选择投保人【通讯地址市区】'
        } else if (!vm.applicant.holder_contact_address) {
          toast_text = '请填写投保人【详细地址】'
        } else if (!vm.checkZipcode()) {
          return false
        } else if (!vm.applicant.is_assured) {
          toast_text = '请选择投保人【是投保人的】'
        } else if (!vm.applicant.DisputedFlag) {
          toast_text = '请选择【合同争议处理方式】'
        } else if (vm.applicant.DisputedFlag === 'LBH0002' && !vm.applicant.ACName) {
          toast_text = '请填写【仲裁委员会】'
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
        // 如果被保险人是本人
        if (this.applicant.is_assured === 'LBK0001') {
          let applicant = Api.obj2json(this.applicant)
          let assu = {}
          assu.insured_name = applicant.holder_name //姓名
          assu.insured_ID_type = applicant.holder_ID_type //证件类型
          assu.insured_ID_type_name = applicant.holder_ID_type_name //证件类型名
          assu.insured_ID_no = applicant.holder_ID_no //证件号码
          assu.insured_birthday = applicant.holder_birthday //出生日期
          assu.insured_ID_expire_end = applicant.holder_ID_expire_end //证件有效期
          assu.insured_gender = applicant.holder_gender //性别  1男  2女
          assu.insured_mobile = applicant.holder_mobile//手机号
          assu.insured_email = applicant.holder_email//邮箱
          assu.insured_height = applicant.holder_height//身高
          assu.insured_weight = applicant.holder_weight//体重
          assu.insured_nation = applicant.holder_nation//国籍
          assu.insured_nation_name = applicant.holder_nation_name//国籍
          assu.insured_company = applicant.holder_company//工作单位
          assu.insured_salary_from = applicant.holder_salary_from//收入来源
          assu.insured_salary_from_name = applicant.holder_salary_from_name//收入来源名
          assu.insured_salary_from_other = applicant.holder_salary_from_other//收入来源具体
          assu.insured_salary_avg = applicant.holder_salary_avg//年收入

          assu.insured_home_province_name = applicant.holder_home_province_name //户籍（省）
          assu.insured_home_province = applicant.holder_home_province//户籍【省】
          assu.insured_contact_province_name = applicant.holder_contact_province_name//现在住址【省】
          assu.insured_contact_province = applicant.holder_contact_province///现在住址【省】
          assu.insured_contact_city_name = applicant.holder_contact_city_name//现在住址【市】
          assu.insured_contact_city = applicant.holder_contact_city//现在住址【市】
          assu.insured_contact_district_name = applicant.holder_contact_district_name//现在住址【区】
          assu.insured_contact_district = applicant.holder_contact_district//现在住址【区】
          assu.insured_contact_address = applicant.holder_contact_address//现在住址【地址详情】
          assu.insured_contact_zip = applicant.holder_contact_zip//现在住址【邮编】
          assu.addr_type = true//是否所有地址同投保人
          assu.has_insured_SSID = applicant.holder_has_SSID//是否有社保
          assu.insured_marriage = applicant.holder_marriage//婚姻状况
          assu.insured_job_code = applicant.holder_job_code//职业
          assu.temp_insured_job_code = applicant.temp_holder_job_code//职业代码
          assu.insured_job_name = applicant.holder_job_name//职业名称
          assu.insured_isTaxResidents = applicant.holder_isTaxResidents
          this.save2local('applicant', this.applicant)
          this.save2local('assured', assu)
          this.$store.dispatch('setApplicant', this.applicant)
          this.$store.dispatch('saveAssured', assu)
          this.$router.push('/prospectus')
        } else {
          this.save2local('applicant', this.applicant)
          this.$store.commit('setApplicant', this.applicant)
          this.$router.push('/beinsured')
        }
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
