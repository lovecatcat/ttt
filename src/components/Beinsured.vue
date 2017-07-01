<template>
  <section id="Beinsured">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header"><span class="app-iconfont">&#xe631;</span>被保险人信息</div>
      <div class="am-list-body">
        <app-input label="姓名">
          <input slot="input" @change="setInfo" v-model.lazy.trim="assured.name" type="text" placeholder="请填写被保险人姓名">
          <div slot="icon" v-show="assured.name != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.name = ''"></i></div>
        </app-input>
        <app-select label="证件类型">
          <select v-model.number="warranty.assu_card_type" v-if="init.assured" @change="typeChange">
            <option disabled>请选择证件类型</option>
            <option v-for="item in init.assured.document_type" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="证件号码">
          <input slot="input" class="uppercase" @change="checkID" v-model.lazy="assured.document_number" type="text" placeholder="请填写被保险人证件号码">
          <div slot="icon" v-show="assured.document_number != ''" class="am-list-clear" @click="assured.document_number = ''"><i class="am-icon-clear am-icon"></i></div>
        </app-input>
        <app-input label="证件有效期">
          <div class="am-ft-right" slot="input">
            <span>长期有效&nbsp;&nbsp;</span>
          </div>
          <div class="am-switch" slot="icon">
            <input type="checkbox" class="am-switch-checkbox" id="longTerm2" v-model="longTerm">
            <label class="am-switch-label" for="longTerm2">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </app-input>
        <div class="am-list-item" v-show="!longTerm">
          <div class="am-list-label tar app-color-warn">有效日期</div>
          <div class="am-list-control">
            <input :class="{'has': assured.document_term != ''}" :readonly="longTerm" v-model="assured.document_term" type="date" placeholder="请填写证件有效期">
          </div>
          <div v-show="assured.document_term" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.document_term = ''"></i></div>
        </div>
        <app-input label="性别">
          <div class="am-ft-right" slot="input">
            <div class="am-switch am-sex">
              <input type="checkbox" @change="setInfo" class="am-switch-checkbox" :disabled="[57 ,15008].indexOf(warranty.assu_card_type)>-1" id="sex2" v-model="warranty.assu_sex" :true-value="11338" :false-value="11339">
              <label class="am-switch-label" for="sex2">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
        </app-input>
        <app-input label="出生日期">
          <input slot="input" @change="setInfo" :class="{'has': assured.birthday != ''}" :readonly="[57 ,15008].indexOf(warranty.assu_card_type)>-1" v-model="assured.birthday" type="date" placeholder="请填写被保险人出生日期">
          <div slot="icon" v-if="warranty.assu_card_type !== 57 && warranty.assu_card_type !== 15008" v-show="assured.birthday" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.birthday = ''"></i></div>
        </app-input>
      </div>
    </div>
    <div class="am-list" v-if="age >= 16">
      <div class="am-list-header">请选择个人税收居民身份类型</div>
      <div class="am-list-body">
        <label class="am-list-item checkbox" v-for="item in init.beneficiary.tax_type">
          <div class="am-checkbox app-checkbox">
            <input type="radio" :value="item.if_id" v-model="warranty.assu_tax_type">
            <span class="icon-check"></span>
          </div>
          <div class="am-list-content">{{item.explain}}</div>
        </label>
      </div>
    </div>
    <div class="am-list am-list-6lb form">
      <div class="am-list-body">
        <app-select label="国籍" v-if="warranty.assu_card_type === 58 || warranty.assu_card_type === 24001">
          <select v-model.number="warranty.assu_nation" v-if="init.assured">
            <option disabled value="0">请选择国籍</option>
            <option v-if="item.if_id!=='63'" v-for="item in init.assured.nationality" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="国籍" v-else>
          <div slot="input">中国</div>
        </app-input>
        <app-input label="户籍" v-if="warranty.assu_card_type !== 58 && warranty.assu_card_type !== 24001">
          <input slot="input" readonly v-model="assured.register_select" type="text" placeholder="请选择被保险人户籍" @click="clearRegister">
          <div slot="icon" v-show="assured.register_select != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearRegister"></i></div>
        </app-input>
        <!-- 户籍 -->
        <app-region v-if="init.applicant && warranty.assu_card_type !== 58  && warranty.appl_card_type !== 24001" :provinces="init.applicant.province" :level="1" ref="register" v-on:regionselect="register_selected"></app-region>
        <!-- 户籍 -->
        <app-input label="通讯地址">
          <div slot="input" @click="clearAddress" placeholder="请点击进行选择" :class="{pd:!assured.address_select}">
            {{assured.address_select}}
          </div>
          <div slot="icon" v-show="assured.address_select != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearAddress"></i></div>
        </app-input>
        <!-- 通讯地址 -->
        <app-region v-if="init.applicant" :provinces="init.applicant.province" ref="address" v-on:regionselect="address_selected"></app-region>
        <div class="am-list-item">
          <div class="am-list-label tar app-color-warn">详细地址</div>
          <div class="am-list-control">
            <input v-model.lazy.trim="assured.address" type="text" placeholder="请填写详细通讯地址">
          </div>
          <div slot="icon" v-show="assured.address != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.address = ''"></i></div>
        </div>
        <!-- 通讯地址 -->
      </div>
    </div>
    <div class="am-list am-list-6lb form">
      <div class="am-list-body">
        <app-input label="邮编">
          <input slot="input" @change="checkZipcode" maxlength="6" v-model.lazy="assured.zipcode" type="text" placeholder="请填写被保险人邮编">
          <div slot="icon" v-show="assured.zipcode != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.zipcode = ''"></i></div>
        </app-input>
        <app-input label="手机号码(选填)">
          <input slot="input" @change="checkPhone" v-model.lazy="assured.tel" type="text" placeholder="请填写被保险人手机号码">
          <div slot="icon" v-show="assured.tel != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.tel = ''"></i></div>
        </app-input>
        <app-input label="工作单位(选填)">
          <input slot="input" v-model.lazy.trim="assured.work_unit" type="text" placeholder="请填写被保险人工作单位">
          <div slot="icon" v-show="assured.work_unit != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.work_unit = ''"></i></div>
        </app-input>
        <app-input label="年收入(万元)">
          <input slot="input" @change="assured.annual_earnings >= 1000000 ? ($toast.open('数值超出范围，请确认单位为万元','warn'),assured.annual_earnings=''):''" v-model.number.lazy="assured.annual_earnings" type="number" placeholder="请填写年收入(万元)">
          <div slot="icon" v-show="assured.annual_earnings != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.annual_earnings = ''"></i></div>
        </app-input>
        <app-select label="收入来源">
          <select v-model.number="warranty.assu_annual_source" v-if="init.assured">
            <option disabled value="0">请选择收入来源</option>
            <option v-for="item in init.assured.annual_source" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <div class="am-list-item" v-show="warranty.assu_annual_source === 15457">
          <div class="am-list-label tar app-color-warn">填写收入来源</div>
          <div class="am-list-control">
            <input v-model.lazy="assured.annual_source_other" type="text" placeholder="请填写收入来源">
          </div>
          <div v-show="assured.annual_source_other != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.annual_source_other = ''"></i></div>
        </div>
        <app-input label="身高">
          <input slot="input" v-model.lazy.number="assured.height" type="number" placeholder="请填写身高(cm)">
          <div slot="icon" v-show="assured.height != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.height = ''"></i></div>
        </app-input>
        <app-input label="体重">
          <input slot="input" v-model.lazy.number="assured.weight" type="number" placeholder="请填写体重(Kg)">
          <div slot="icon" v-show="assured.weight != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.weight = ''"></i></div>
        </app-input>
        <!-- 职业 -->
        <app-input label="职业" v-if="age > 15">
          <div slot="input" @click="$refs.occupation.show = true" placeholder="请点击选择职业" :class="{pd:!assured.occupation}">
            {{assured.occupation}}
          </div>
          <div slot="icon" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearOccupation"></i></div>
        </app-input>
        <app-input label="职业" v-else>
          <div slot="input" :class="{pd:!assured.occupation}">
            {{assured.occupation}}
          </div>
        </app-input>
        <app-occupation ref="occupation"></app-occupation>
        <!-- 职业 -->
      </div>
    </div>
    <div class="am-tab am-fixed am-fixed-bottom app-navi">
      <router-link to="/insured" class="am-tab-item">上一步</router-link>
      <router-link to="/prospectus" class="am-tab-item selected">下一步</router-link>
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
  name: 'beinsured',
  components: {
    'app-region': Region,
    'app-occupation': Occupation
  },
  data() {
    return {
      longTerm: false, //是否长期有效
      cardinfo: {}, //身份证信息
      age: '', //年龄
      // 被保险人信息
      assured: {
        war_id: '', //
        register_select: '', //户籍展示
        address_select: '', //通信展示
        name: '', //姓名
        height: '', //身高(厘米)
        weight: '', //体重(kg)
        register: '', //户籍
        annual_earnings: '', //年收入
        annual_source_other: '', //其他收入来源
        birthday: '', //出生日期
        // 证件
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
        tel: '' //联系电话
      },
      // 保单信息
      warranty: {
        assu_sex: '11338', //性别
        assu_card_type: 57, //证件类型
        assu_nation: 63, //国籍
        assu_annual_source: 0, //收入来源
        assu_tax_type: '', //税收类型
        assu_occupation_code: '' //职业代码
      }
    }
  },
  computed: {
    init() {
      return this.$store.state.init
    }
  },
  created() {
    if (this.assured.document_term === '9999-12-30') {
      this.longTerm = true
    }
  },
  watch: {
    longTerm(val) {
      this.assured.document_term = val ? '9999-12-30' : ''
    },
    age(val) {
      if (val >= 0 && val <= 6) {
        this.assured.occupation = '学龄前儿童'
        this.warranty.assu_occupation_code = 9602
      } else if (val > 6 && val <= 15) {
        this.assured.occupation = '一般学生'
        this.warranty.assu_occupation_code = 9601
      } else {
        this.assured.occupation = ''
        this.warranty.assu_occupation_code = ''
      }
      if (val < 16) {
        this.warranty.assu_tax_type = ''
      }
    }
  },
  methods: {
    typeChange() {
      this.assured.document_number = ''
      this.assured.register = ''
      this.assured.register_select = ''
      this.warranty.assu_nation = this.warranty.assu_card_type === 58 || this.warranty.assu_card_type === 24001 ? 0 : 63
    },
    // 证件号码校验
    checkID() {
      this.IDValidate() && this.checkIDExist()
    },
    // 检查ID是否有效
    IDValidate() {
      const vm = this
      const type = vm.warranty.assu_card_type
      const id = vm.assured.document_number
      var toast_text = null

      switch (type) {
        case 15008: // 户口簿
        case 57: // 身份证
          const addr = vm.$store.state.addr
          vm.age = 0

          if (Validator.isValid(id, 18)) {
            const idInfo = Validator.getInfo(id)
            const code = idInfo.addrCode.substr(0, 2)
            const sex = { // 0为女，1为男
              1: '11338',
              0: '11339'
            }
            vm.assured.birthday = idInfo.birth
            vm.warranty.assu_sex = sex[idInfo.sex]
            vm.assured.register_select = addr[code].name
            vm.assured.register = addr[code].if_id

            const age = vm.getAge(vm.assured.birthday)
            vm.age = age
            if (age < 16) {
              vm.assured.annual_earnings = 0 //小于16周岁默认为0，可修改
              vm.warranty.assu_annual_source = 15457
              vm.assured.annual_source_other = '无'
            }
          } else {
            toast_text = '请输入正确的18位数证件号码'
            vm.assured.register_select = ''
            vm.assured.birthday = ''
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
      vm.assured.document_number = id.toUpperCase()
      return true
    },
    // 检查ID是否存在
    checkIDExist() {
      const vm = this
      const id = vm.assured.document_number
      Api.queryID(id, 'assured', res => {
        if (res.name && res.name.indexOf('Error') > -1) {
          vm.$toast.open('服务器开小差了', 'error')
          return
        }
        // 不存在 assu_id
        if (!res.assu_id) {
          vm.assured.assu_id && vm.$delete(vm.assured, 'assu_id')
          return false
        }
        vm.cardinfo = res
        vm.$set(vm.assured, 'assu_id', res.assu_id)
        vm.setInfo()
      })
    },
    setInfo() {
      var vm = this
      var res = vm.cardinfo

      if (vm.assured.birthday) {
        vm.age = Api.getAge(vm.assured.birthday)
      }

      // 是否同人
      if (vm.assured.name !== res.name || vm.assured.document_number !== res.document_number || vm.assured.birthday !== res.birthday) {
        return
      }
      var assured = {}

      assured.name = res.name
      assured.annual_earnings = Number(res.annual_earnings)
      assured.document_term = res.document_term
      assured.height = res.height
      assured.weight = res.weight
      assured.register = res.register
      assured.tel = res.tel
      assured.work_unit = res.work_unit
      assured.zipcode = res.zipcode
      if (res.document_term === '9999-12-30') vm.longTerm = true
      vm.assured = Object.assign(vm.assured, assured)
    },
    // 户籍选择
    register_selected(selected) {
      var toast_text = null
      if (selected.length === 0 || !selected[0]) {
        toast_text = '请先选择户籍'
      }
      this.local && console.info(selected)
      if (this.warranty.assu_card_type === 15009 && ['3844', '3866'].indexOf(selected[0].if_id) === -1) {
        toast_text = '证件类型为港澳居民来往内地通行证时，户籍必须是香港或澳门'
      } else if (this.warranty.assu_card_type === 15010 && selected[0].if_id !== '3453') {
        toast_text = '证件类型为台湾居民来往大陆通行证时，户籍必须是台湾'
      } else if ([57, 59, 15008].indexOf(this.warranty.assu_card_type) > -1 && ['3453', '3844', '3866'].indexOf(selected[0].if_id) > -1) {
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

      this.local && console.info(selected)
      this.$set(this.assured, 'register', selected[0].if_id)
      this.$set(this.assured, 'register_select', selected[0].explain)
    },
    // 清除户籍
    clearRegister() {
      this.assured.register = ''
      this.assured.register_select = ''
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
      var select_show = selected[0].explain
      vm.$set(vm.assured, 'province', selected[0].if_id)
      if (selected[1]) {
        select_show += selected[1].explain
        vm.$set(vm.assured, 'city', selected[1].if_id)
      }
      if (selected[2]) {
        select_show += selected[2].explain
        vm.$set(vm.assured, 'district', selected[2].if_id)
        Api.queryZipcode(selected[2].code, response => {
          if (!response) {
            Api.queryZipcode(selected[1].code, response => {
              if (!response) return
              vm.$set(vm.assured, 'zipcode', response)
            })
            return
          }
          vm.assured.zipcode = response
        })
      }
      vm.$set(vm.assured, 'address_select', select_show)
    },
    // 清除通讯地址
    clearAddress() {
      this.assured.province = ''
      this.assured.city = ''
      this.assured.district = ''
      this.assured.address_select = ''
      this.$refs.address.clear()
    },
    // 邮编校验
    checkZipcode() {
      var zipcode = this.assured.zipcode
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
      const tel = this.assured.tel
      var toast_text = null
      if (this.warranty.assu_card_type === 15009 && !/^1[3|4|5|7|8][0-9]{9}$|^00852[0-9]{8}$/.test(tel)) {
        toast_text = '请输入正确的11位或13位手机号'
      } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(tel)) {
        toast_text = '请输入正确的11位手机号'
      }
      if (toast_text) {
        this.$toast.open(toast_text, 'warn')
        return false
      }
      return true
    },
    // 设置职业
    setOccupation(selected) {
      this.local && console.log(selected)
      this.assured.occupation = selected.explain
      this.warranty.assu_occupation_code = selected.if_id
    },
    // 清除职业
    clearOccupation() {
      this.assured.occupation = ''
      this.warranty.assu_occupation_code = ''
      this.$refs.occupation.show = true
    },
    // 校验表单
    checkForm() {
      const vm = this
      var toast_text = null
      if (!vm.assured.name) {
        toast_text = '请填写被保险人【姓名】'
      } else if (!vm.assured.document_number) {
        toast_text = '请填写被保险人【证件号码】'
      } else if (vm.longTerm === false && (!vm.assured.document_term || vm.assured.document_term === '0000-00-00')) {
        toast_text = '请填写被保险人【证件有效期】'
      } else if (!vm.assured.birthday) {
        toast_text = '请选择被保险人【出生日期】'
      } else if (!vm.warranty.assu_tax_type && vm.age >= 16) {
        toast_text = '请选择被保险人个人税收居民身份类型'
      } else if (!vm.warranty.assu_nation) {
        toast_text = '请选择被保险人【国籍】'
      } else if (!vm.assured.register && vm.warranty.assu_card_type !== 58 && vm.warranty.assu_card_type !== 24001) {
        toast_text = '请选择被保险人【户籍】'
      } else if (!vm.assured.province) {
        toast_text = '请选择被保险人【通讯地址省份】'
      } else if (!vm.assured.city && vm.assured.province !== '3877') {
        toast_text = '请选择被保险人【通讯地址市区】'
      } else if (!vm.assured.district && vm.assured.province !== '3877') {
        toast_text = '请选择被保险人【通讯地址县/区】'
      } else if (!vm.assured.address) {
        toast_text = '请填写被保险人【详细地址】'
      } else if (!this.checkZipcode()) {
        return false
      } else if (!vm.assured.annual_earnings && vm.assured.annual_earnings !== 0) {
        toast_text = '请填写被保险人【年收入】'
      } else if (!vm.warranty.assu_annual_source) {
        toast_text = '请选择被保险人【收入来源】'
      } else if (vm.warranty.assu_annual_source === 15457 && !vm.assured.annual_source_other) {
        toast_text = '请填写投保人【收入来源】'
      } else if (!vm.assured.height) {
        toast_text = '请填写被保险人【身高】'
      } else if (!vm.assured.weight) {
        toast_text = '请填写被保险人【体重】'
      } else if (!vm.warranty.assu_occupation_code) {
        toast_text = '请填写被保险人【职业】'
      }
      if (toast_text) {
        console.info(toast_text)
        this.$toast.open(toast_text, '')
        return false
      }
      return this.IDValidate()
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/insured') {
      next()
      return false
    }
    if (!this.checkForm()) {
      return false
    }
    this.$store.commit('saveAssured', this.assured)
    this.$store.commit('setWarranty', this.warranty)
    next()
  }
}
</script>
