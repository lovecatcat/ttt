<template>
  <section id="Insured">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header"><span class="app-iconfont">&#xe631;</span>投保人信息</div>
      <div class="am-list-body">
        <app-input label="姓名">
          <input slot="input" v-model.lazy.trim="applicant.name" type="text" placeholder="请填写投保人姓名" @change="setInfo">
          <div slot="icon" v-show="applicant.name != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.name = ''"></i></div>
        </app-input>
        <app-select label="证件类型">
          <select v-model.number="warranty.appl_card_type" v-if="init.applicant" @change="typeChange">
            <option disabled>请选择证件类型</option>
            <option v-for="item in init.applicant.document_type" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="证件号码">
          <input slot="input" @change="checkID" v-model.lazy="applicant.document_number" type="text" placeholder="请填写投保人证件号码" class="uppercase">
          <div slot="icon" v-show="applicant.document_number != ''" class="am-list-clear" @click="applicant.document_number = ''"><i class="am-icon-clear am-icon"></i></div>
        </app-input>
        <app-input label="证件有效期">
          <div class="am-ft-right" slot="input">
            <span>长期有效&nbsp;&nbsp;</span>
          </div>
          <div class="am-switch" slot="icon">
            <input type="checkbox" class="am-switch-checkbox" id="longTerm" v-model="longTerm">
            <label class="am-switch-label" for="longTerm">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </app-input>
        <div class="am-list-item" v-show="!longTerm">
          <div class="am-list-label tar app-color-warn">有效日期</div>
          <div class="am-list-control">
            <input :class="{'has': applicant.document_term != ''}" :readonly="longTerm" v-model="applicant.document_term" type="date" placeholder="请填写证件有效期">
          </div>
          <div v-show="applicant.document_term" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.document_term = ''"></i></div>
        </div>
        <app-input label="性别">
          <div class="am-ft-right" slot="input">
            <div class="am-switch am-sex">
              <input type="checkbox" @change="setInfo" class="am-switch-checkbox" for="sex" :disabled="warranty.appl_card_type === 57 || warranty.appl_card_type === 15008" v-model="warranty.appl_sex" :true-value="11338" :false-value="11339">
              <label class="am-switch-label" for="sex">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
        </app-input>
        <!-- 证件为身份证和户口本 性别和 出生日期 不允许修改 -->
        <app-input label="出生日期">
          <input slot="input" @change="setInfo" :class="{'has': applicant.birthday != ''}" :readonly="warranty.appl_card_type === 57 || warranty.appl_card_type === 15008" v-model="applicant.birthday" type="date" placeholder="请填写投保人出生日期">
          <div slot="icon" v-if="warranty.appl_card_type !== 57 && warranty.appl_card_type !== 15008" v-show="applicant.birthday" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.birthday = ''"></i></div>
        </app-input>
      </div>
    </div>
    <div class="am-list" v-if="getAge(applicant.birthday) >= 16">
      <div class="am-list-header">请选择个人税收居民身份类型</div>
      <div class="am-list-body">
        <label class="am-list-item checkbox" v-for="item in init.beneficiary.tax_type">
          <div class="am-checkbox app-checkbox">
            <input type="radio" :value="item.if_id" v-model="warranty.appl_tax_type">
            <span class="icon-check"></span>
          </div>
          <div class="am-list-content">{{item.explain}}</div>
        </label>
      </div>
    </div>
    <div class="am-list am-list-6lb form">
      <div class="am-list-body">
        <!-- 证件为护照时 可以修改国籍 -->
        <app-select label="国籍" v-if="warranty.appl_card_type === 58 || warranty.appl_card_type === 24001">
          <select v-model.number="warranty.appl_nation" v-if="init.applicant">
            <option disabled value="0">请选择国籍</option>
            <option v-if="item.if_id !== '63'" v-for="item in init.applicant.nationality" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="国籍" v-else>
          <div slot="input">中国</div>
        </app-input>
        <app-input label="户籍" v-if="warranty.appl_card_type !== 58 && warranty.appl_card_type !== 24001">
          <input slot="input" readonly @click="clearRegister" v-model="applicant.register_select" type="text" placeholder="请选择投保人户籍">
          <div slot="icon" v-show="applicant.register_select != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearRegister"></i></div>
        </app-input>
        <!-- 户籍 -->
        <app-region v-if="init.applicant && warranty.appl_card_type !== 58 && warranty.appl_card_type !== 24001" :provinces="init.applicant.province" v-on:regionselect="register_selected" ref="register" :level="1"></app-region>
        <!-- 户籍 -->
        <app-input label="通讯地址">
          <div slot="input" @click="clearAddress" placeholder="请点击进行选择" :class="{pd:!applicant.address_select}">
            {{applicant.address_select}}
          </div>
          <div slot="icon" v-show="applicant.address_select != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearAddress"></i></div>
        </app-input>
        <!-- 通讯地址 -->
        <app-region v-if="init.applicant" :provinces="init.applicant.province" v-on:regionselect="address_selected" ref="address"></app-region>
        <!-- 通讯地址 -->
        <div class="am-list-item">
          <div class="am-list-label tar app-color-warn">详细地址</div>
          <div class="am-list-control">
            <input v-model.lazy.trim="applicant.address" type="text" placeholder="请填写详细通讯地址">
          </div>
          <div slot="icon" v-show="applicant.address != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.address = ''"></i></div>
        </div>
      </div>
    </div>
    <div class="am-list am-list-6lb form">
      <div class="am-list-body">
        <app-input label="邮编">
          <input slot="input" @change="checkZipcode" maxlength="6" v-model.lazy="applicant.zipcode" type="text" placeholder="请填写投保人邮编">
          <div slot="icon" v-show="applicant.zipcode != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.zipcode = ''"></i></div>
        </app-input>
        <app-input label="手机号码">
          <input slot="input" @change="checkPhone" v-model.lazy="applicant.tel" type="text" placeholder="请填写投保人手机号码">
          <div slot="icon" v-show="applicant.tel != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.tel = ''"></i></div>
        </app-input>
        <app-input label="固定电话(选填)">
          <input slot="input" @change="checkTel" v-model.lazy.trim="applicant.visit_tel" type="text" placeholder="请填写投保人固定电话">
          <div slot="icon" v-show="applicant.visit_tel != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.visit_tel = ''"></i></div>
        </app-input>
        <app-input label="工作单位(选填)">
          <input slot="input" v-model.lazy.trim="applicant.work_unit" type="text" placeholder="请填写投保人工作单位">
          <div slot="icon" v-show="applicant.work_unit != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.work_unit = ''"></i></div>
        </app-input>
        <app-input label="年收入(万元)">
          <input slot="input" @change="applicant.annual_earnings >= 1000000 ? ($toast.open('数值超出范围，请确认单位为万元','warn'),applicant.annual_earnings=''):''" v-model.number.lazy="applicant.annual_earnings" type="number" placeholder="请填写年收入(万元)">
          <div slot="icon" v-show="applicant.annual_earnings != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.annual_earnings = ''"></i></div>
        </app-input>
        <app-select label="收入来源">
          <select v-model.number="warranty.appl_annual_source" v-if="init.applicant">
            <option disabled value="0">请选择收入来源</option>
            <option v-for="item in init.applicant.annual_source" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="" v-show="warranty.appl_annual_source === 15457">
          <input slot="input" v-model.lazy="applicant.annual_source_other" type="text" placeholder="请填写收入来源">
          <div slot="icon" v-show="applicant.annual_source_other != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.annual_source_other = ''"></i></div>
        </app-input>
        <app-input label="身高">
          <input slot="input" v-model.number.lazy="applicant.height" type="number" placeholder="请填写身高(cm)">
          <div slot="icon" v-show="applicant.height != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.height = ''"></i></div>
        </app-input>
        <app-input label="体重">
          <input slot="input" v-model.number.lazy="applicant.weight" type="number" placeholder="请填写体重(Kg)">
          <div slot="icon" v-show="applicant.weight != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.weight = ''"></i></div>
        </app-input>
        <app-select label="是被保险人的">
          <select v-model.number="warranty.is_assured" v-if="init.warranty">
            <option disabled>请选择</option>
            <option v-for="item in init.warranty.is_assured" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="" v-show="warranty.is_assured === 15017">
          <input slot="input" v-model="warranty.is_assured_val" type="text" placeholder="请填写是被保险人的">
          <div slot="icon" @click="warranty.is_assured_val = ''" v-show="warranty.is_assured_val != ''" class="am-list-clear"><i class="am-icon-clear am-icon"></i></div>
        </app-input>
        <app-input label="职业">
          <div slot="input" @click="$refs.occupation.show = true" placeholder="请点击选择职业" :class="{pd:!applicant.occupation}">
            {{applicant.occupation}}
          </div>
          <div slot="icon" v-show="applicant.occupation" @click="clearOccupation" class="am-list-clear"><i class="am-icon-clear am-icon"></i></div>
        </app-input>
        <!-- 职业 -->
        <app-occupation ref="occupation"></app-occupation>
        <!-- 职业 -->
        <app-select label="合同争议处理方式">
          <select v-model="warranty.contract_handle" v-if="init.warranty">
            <option disabled>请选择</option>
            <option v-for="item in init.warranty.contract_handle" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="仲裁委员会" v-show="warranty.contract_handle === '109'">
          <input slot="input" v-model.lazy="warranty.contract_handle_value" type="text" placeholder="请填写仲裁委员会名称">
          <div slot="icon" v-show="warranty.contract_handle_value != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="warranty.contract_handle_value = ''"></i></div>
        </app-input>
      </div>
    </div>
    <div class="am-tab am-fixed am-fixed-bottom app-navi">
      <router-link to="/" class="am-tab-item">上一步</router-link>
      <a @click="next" class="am-tab-item selected">下一步</a>
    </div>
  </section>
</template>
<script>
import Validator from '../widgets/IDValidator'
import Api from '../api'
// 区域选择器
import Region from './Region'
import Occupation from './Occupation'

export default {
  name: 'Insured',
  components: {
    'app-region': Region,
    'app-occupation': Occupation
  },
  data() {
    return {
      longTerm: false, //是否长期有效
      cardinfo: {}, //身份证信息
      // 投保人信息
      applicant: {
        register_select: '', //户籍展示
        address_select: '', //通信展示
        name: '', //姓名
        height: '', //身高(厘米)
        weight: '', //体重(kg)
        register: '', //户籍
        annual_earnings: '', //年收入
        // annual_source: 0, //收入来源
        annual_source_other: '', //其他收入来源
        birthday: '', //出生日期
        // 证件
        // document_type: '1', //证件类型
        document_type_val: '', //证件描述
        document_number: '', //证件号码
        document_term: '', //证件有效期
        // 通信
        address: '', //通信地址
        province: '', //省
        city: '', //市
        district: '', //区
        zipcode: '', //通信邮编
        // 职业
        occupation: '', //职业

        work_unit: '', //工作单位
        visit_tel: '', //回访电话
        tel: '' //联系电话
      },
      assured: {
        war_id: ''
      },
      // 保单信息
      warranty: {
        appl_sex: '11338', //性别
        appl_card_type: 57, //证件类型
        appl_nation: 63, //国籍
        appl_annual_source: 0, //收入来源
        appl_occupation_code: '', //职业代码
        appl_tax_type: '', //税收类型

        is_assured: 15000, //是被保险人的
        is_assured_val: '', //是被保险人值

        contract_handle: '108', //合同争议处理方式
        contract_handle_value: '' //填写仲裁委员会名称
      }
    }
  },
  computed: {
    init() {
      return this.$store.state.init || {}
    }
  },
  watch: {
    longTerm(val) {
      this.applicant.document_term = val ? '9999-12-30' : ''
    }
  },
  created() {
    if (this.applicant.document_term === '9999-12-30') {
      this.longTerm = true
    }
    if (this.applicant.document_number) {
      this.checkID()
    }
  },
  methods: {
    typeChange() {
      this.applicant.document_number = ''
      this.applicant.register_select = ''
      this.applicant.register = ''
      this.warranty.appl_nation = this.warranty.appl_card_type === 58 || this.warranty.appl_card_type === 24001 ? 0 : 63
    },
    checkID() { // 证件号码校验
      this.IDValidate() && this.checkIDExist()
    },
    // 检查ID是否有效
    IDValidate() {
      const vm = this
      const type = vm.warranty.appl_card_type
      const id = vm.applicant.document_number
      var toast_text = null

      switch (type) {
        case 15008: // 户口簿
        case 57: // 身份证

          const addr = this.$store.state.addr

          if (Validator.isValid(id, 18)) {
            const idInfo = Validator.getInfo(id)
            const code = idInfo.addrCode.substr(0, 2)
            const sex = { // 0为女，1为男
              1: '11338',
              0: '11339'
            }
            vm.applicant.birthday = idInfo.birth
            vm.warranty.appl_sex = sex[idInfo.sex]
            vm.applicant.register_select = addr[code].name
            vm.applicant.register = addr[code].if_id

            return this.checkAge()
          } else {
            toast_text = '请输入正确的18位数证件号码'
            vm.applicant.register_select = ''
            vm.applicant.birthday = ''
          }
          break
        case 58: // 护照
          if (id.length <= 3) {
            toast_text = '护照必须是大于3位'
          }
          break
        case 59: // 军官证
          if (id.length > 18 || id.length < 10) {
            toast_text = '军官证必须是10-18位'
          }
          break
        case 15009: //港澳
          if (id.length <= 8) {
            toast_text = '港澳居民来往内地通行证号码必须大于8位'
          }
          break
        case 15010: //台湾
          if (id.length < 8) {
            toast_text = '台湾居民来往大陆通行证号码必须大于等于8位'
          }
          break
        case 24001: // 外国人身份证
          if (id.length !== 15) {
            toast_text = '外国人永久居留身份证位为15位'
          } else if (!/^[a-z]{3}\d{12}$/gi.test(id)) {
            toast_text = '外国人永久居留身份证号码不正确'
          }
          break
        default:
          break
      }
      if (toast_text) {
        vm.$toast.open(toast_text, '')
        return false
      }
      vm.applicant.document_number = id.toUpperCase()
      return true
    },
    // 检查ID是否存在
    checkIDExist() {
      const vm = this
      const id = vm.applicant.document_number
      Api.queryID(id, 'applicant', res => {
        if (res.name && res.name.indexOf('Error') > -1) {
          vm.$toast.open('服务器开小差了', 'error')
          return
        }

        // 不存在 appl_id
        if (!res.appl_id && vm.applicant.appl_id) {
          vm.$delete(vm.applicant, 'appl_id')
          vm.cardinfo = {}
          return false
        }
        vm.cardinfo = res
        vm.$set(vm.applicant, 'appl_id', res.appl_id)
        vm.setInfo()
      })
    },
    setInfo() {
      var vm = this
      var res = vm.cardinfo

      // 是否同人
      if (vm.applicant.name !== res.name || vm.applicant.document_number !== res.document_number || vm.applicant.birthday !== res.birthday) {
        return
      }
      var applicant = {}

      applicant.annual_earnings = Number(res.annual_earnings)
      applicant.document_term = res.document_term
      applicant.height = res.height
      applicant.weight = res.weight
      applicant.name = res.name
      applicant.register = res.register
      applicant.tel = res.tel
      applicant.visit_tel = res.visit_tel
      applicant.work_unit = res.work_unit
      applicant.zipcode = res.zipcode
      if (res.document_term === '9999-12-30') vm.longTerm = true
      vm.applicant = Object.assign(vm.applicant, applicant)
    },
    // 年龄验证
    checkAge() {
      const age = this.getAge(this.applicant.birthday)
      if (age <= 16) {
        this.$toast.open('投保人年龄不符合规定，请更换投保人', 'error')
        return false
      }
      if (age < 16) {
        this.warranty.appl_tax_type = ''
      }
      return true
    },
    // 户籍选择
    register_selected(selected) {
      var toast_text = null
      if (selected.length === 0 || !selected[0]) {
        toast_text = '请先选择户籍'
      }
      this.local && console.info(selected)
      if (this.warranty.appl_card_type === 15009 && ['3844', '3866'].indexOf(selected[0].if_id) === -1) {
        toast_text = '证件类型为港澳居民来往内地通行证时，户籍必须是香港或澳门'
      } else if (this.warranty.appl_card_type === 15010 && selected[0].if_id !== '3453') {
        toast_text = '证件类型为台湾居民来往大陆通行证时，户籍必须是台湾'
      } else if ([57, 59, 15008].indexOf(this.warranty.appl_card_type) > -1 && ['3453', '3844', '3866'].indexOf(selected[0].if_id) > -1) {
        toast_text = '证件类型为身份证、户口簿或军官证时，户籍不能是香港、澳门或台湾'
      }
      if (toast_text) {
        console.info(toast_text)
        this.$toast.open(toast_text, '', 3000)
        this.$nextTick(() => {
          this.$refs.register.clear()
        })
        return false
      }
      this.$set(this.applicant, 'register', selected[0].if_id)
      this.$set(this.applicant, 'register_select', selected[0].explain)
    },
    // 清除户籍
    clearRegister() {
      this.applicant.register = ''
      this.applicant.register_select = ''
      this.$refs.register.clear()
    },
    // 通讯地址选择
    address_selected(selected) {
      if (selected.length === 0 || !selected[0]) {
        this.$toast.open('请先选择通讯地址', 'warn')
        return false
      }
      this.local && console.info(selected)
      var vm = this
      var select_show = ''
      select_show += selected[0].explain
      vm.$set(vm.applicant, 'province', selected[0].if_id)
      if (selected[1]) {
        select_show += selected[1].explain
        vm.$set(vm.applicant, 'city', selected[1].if_id)
      }
      if (selected[2]) {
        select_show += selected[2].explain
        vm.$set(vm.applicant, 'district', selected[2].if_id)
        Api.queryZipcode(selected[2].code, response => {
          if (!response) {
            Api.queryZipcode(selected[1].code, response => {
              if (!response) return
              vm.$set(vm.applicant, 'zipcode', response)
            })
            return
          }
          vm.applicant.zipcode = response
        })
      }
      vm.$set(vm.applicant, 'address_select', select_show)
    },
    // 清除通讯地址
    clearAddress() {
      this.applicant.province = ''
      this.applicant.city = ''
      this.applicant.district = ''
      this.applicant.address_select = ''
      this.$refs.address.clear()
    },
    // 邮编校验
    checkZipcode() {
      var zipcode = this.applicant.zipcode
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
      const tel = this.applicant.tel
      var toast_text = null
      if (!tel) {
        toast_text = '手机号不能为空'
      } else if (this.warranty.appl_card_type === 15009) {
        if (!/^1[3|4|5|7|8][0-9]{9}$|^00852[0-9]{8}$/.test(tel)) {
          toast_text = '请输入正确的11位或13位手机号'
        }
      } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(tel)) {
        toast_text = '请输入正确的11位手机号'
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
      if (!/^0\d{10,11}$/.test(this.applicant.visit_tel)) {
        this.$toast.open('电话以0开头,格式为区号+号码,如:01012345678', '')
      }
    },
    // 设置职业
    setOccupation(selected) {
      this.warranty.appl_occupation_code = selected.if_id
      this.applicant.occupation = selected.explain
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
      if (!vm.applicant.name) {
        toast_text = '请填写投保人【姓名】'
      } else if (!vm.IDValidate()) {
        return false
      } else if (vm.longTerm === false && (!vm.applicant.document_term || vm.applicant.document_term === '0000-00-00')) {
        toast_text = '请填写投保人【证件有效期】'
      } else if (!vm.applicant.birthday) {
        toast_text = '请选择投保人【出生日期】'
      } else if (!this.checkAge()) {
        return false
      } else if (!vm.warranty.appl_tax_type && vm.getAge(vm.applicant.birthday) >= 16) {
        toast_text = '请选择投保人个人税收居民身份类型'
      } else if (!vm.warranty.appl_nation) {
        toast_text = '请选择投保人【国籍】'
      } else if (!vm.applicant.register && vm.warranty.appl_card_type !== 58 && this.warranty.appl_card_type !== 24001) {
        toast_text = '请选择投保人【户籍】'
      } else if (!vm.applicant.province) {
        toast_text = '请选择投保人【通讯地址省份】'
      } else if (!vm.applicant.city && vm.applicant.province !== '3877') {
        toast_text = '请选择投保人【通讯地址市区】'
      } else if (!vm.applicant.district && vm.applicant.province !== '3877') {
        toast_text = '请选择投保人【通讯地址县/区】'
      } else if (!vm.applicant.address) {
        toast_text = '请填写投保人【详细地址】'
      } else if (!this.checkZipcode()) {
        return false
      } else if (!this.checkPhone()) {
        return false
      } else if (!vm.applicant.annual_earnings && vm.assured.annual_earnings !== 0) {
        toast_text = '请填写投保人【年收入】'
      } else if (!vm.warranty.appl_annual_source) {
        toast_text = '请选择投保人【收入来源】'
      } else if (vm.warranty.appl_annual_source === 15457 && !vm.applicant.annual_source_other) {
        toast_text = '请填写投保人【收入来源】'
      } else if (!vm.applicant.height) {
        toast_text = '请填写投保人【身高】'
      } else if (!vm.applicant.weight) {
        toast_text = '请填写投保人【体重】'
      } else if (!vm.warranty.is_assured) {
        toast_text = '请选择投保人【是投保人的】'
      } else if (!vm.warranty.appl_occupation_code) {
        toast_text = '请选择投保人【职业】'
      } else if (!vm.warranty.contract_handle) {
        toast_text = '请选择【合同争议处理方式】'
      } else if (vm.warranty.contract_handle === '109' && !vm.warranty.contract_handle_value) {
        toast_text = '请填写【仲裁委员会】'
      }
      if (toast_text) {
        console.info(toast_text)
        this.$toast.open(toast_text, '')
        return false
      }
      return true
    },
    next() {
      if (!this.checkForm()) {
        return false
      }
      this.$toast.close()

      // 如果被保险人是本人
      if (this.warranty.is_assured === 15000) {
        var assured = Api.obj2json(this.applicant)
        this.warranty.assu_card_type = this.warranty.appl_card_type
        this.warranty.assu_nation = this.warranty.appl_nation
        this.warranty.assu_annual_source = this.warranty.appl_annual_source
        this.warranty.assu_occupation_code = this.warranty.appl_occupation_code
        this.warranty.assu_tax_type = this.warranty.appl_tax_type
        this.warranty.assu_sex = this.warranty.appl_sex
        this.assured = Object.assign(this.assured, assured)
        this.$store.dispatch('setApplicant', this.applicant)
        this.$store.dispatch('setWarranty', this.warranty)

        Api.queryID(this.applicant.document_number, 'assured', res => {
          if (res && res.assu_id) {
            this.assured.assu_id = res.assu_id
          } else {
            this.$delete(this.assured, 'assu_id')
          }
          this.$delete(this.assured, 'appl_id')
          this.$store.dispatch('saveAssured', this.assured)
          this.$router.push('/prospectus')
        })
      } else {
        this.$store.commit('setApplicant', this.applicant)
        this.$store.commit('setWarranty', this.warranty)
        this.$router.push('/beinsured')
      }
    }
  }
}
</script>
<style>
input[type="date"]:before,
input[type="month"]:before {
  color: #999;
  content: attr(placeholder);
}

input[type="date"].has:before,
input[type="month"].has:before {
  content: "" !important;
}

.pd:before {
  color: #999;
  content: attr(placeholder);
}

.pd {
  -webkit-user-select: none;
}
</style>
