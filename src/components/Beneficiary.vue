<template>
  <section class="Beneficiary">
    <div class="am-list am-list-6lb form">
      <div class="am-list-header fn-clear" v-if="count > 1">
        第 {{index+1}} 个受益人
        <a v-show="count > 1 && crt > 0" v-if="index>0" class="fn-right" @click="del">删除该受益人</a>
      </div>
      <div class="am-list-body">
        <div class="am-list-item" v-if="warranty.is_assured && index == 0" v-show="warranty.is_assured != 21">
          <div class="am-list-label">同投保人</div>
          <div class="am-list-control tar">
            <div class="am-switch">
              <input type="checkbox" class="am-switch-checkbox" id="same" v-model="same">
              <label class="am-switch-label" for="same">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
        </div>
        <app-input label="姓名">
          <input slot="input" v-model.trim="beneficiary.name" type="text" placeholder="请填写受益人姓名">
          <div slot="icon" v-show="beneficiary.name != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="beneficiary.name = ''"></i></div>
        </app-input>
        <app-select label="证件类型">
          <select v-model="beneficiary.document_type" v-if="init">
            <option disabled>请选择</option>
            <option v-for="type in init.applicant.document_type" :value="type.bs_id">{{type.explain}}</option>
          </select>
        </app-select>
        <app-input label="证件号码">
          <input slot="input" @change="IDValidate" v-model.lazy="beneficiary.document_number" type="text" placeholder="请填写受益人证件号码">
          <div slot="icon" v-show="beneficiary.document_number != ''" class="am-list-clear" @click="beneficiary.document_number = ''"><i class="am-icon-clear am-icon"></i></div>
        </app-input>
        <app-input label="证件有效期">
          <div class="am-ft-right" slot="input">
            <span>长期有效&nbsp;&nbsp;</span>
          </div>
          <div class="am-switch" slot="icon">
            <input type="checkbox" class="am-switch-checkbox" id="longTerm3" v-model="longTerm">
            <label class="am-switch-label" for="longTerm3">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </app-input>
        <div class="am-list-item" v-show="!longTerm">
          <div class="am-list-control">
            <input :class="{'has':beneficiary.document_term != ''}" v-model="beneficiary.document_term" type="date" placeholder="请填写证件有效期">
          </div>
          <div v-show="beneficiary.document_term" class="am-list-clear"><i class="am-icon-clear am-icon" @click="beneficiary.document_term = ''"></i></div>
        </div>
        <app-input label="性别">
          <div class="am-ft-right" slot="input">
            <div class="am-switch am-sex">
              <input type="checkbox" class="am-switch-checkbox" :disabled="same || beneficiary.document_type in [1,5]" id="sex3" v-model="beneficiary.sex" :true-value="15" :false-value="16">
              <label class="am-switch-label" for="sex3">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
        </app-input>
        <app-input label="出生日期">
          <input slot="input" :class="{'has': beneficiary.birthday != ''}" v-model="beneficiary.birthday" :disabled="beneficiary.document_type in [1,5]" type="date" placeholder="请填写受益人出生日期">
          <div slot="icon" v-show="beneficiary.birthday  && !same  && !beneficiary.document_type in [1,5]" class="am-list-clear"><i class="am-icon-clear am-icon" @click="beneficiary.birthday = ''"></i></div>
        </app-input>
        </app-input>
        <app-select label="是被保人的">
          <select v-model="beneficiary.relationship" v-if="init">
            <option disabled>请选择</option>
            <option v-for="item in init.beneficiary.relationship" :value="item.bs_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-select label="受益顺序">
          <select v-model.number="beneficiary.benefited_level">
            <option disabled>请选择</option>
            <option :value="item" v-for="item in 10">{{item}}</option>
          </select>
        </app-select>
        <app-input label="受益份额(%)">
          <input slot="input" type="number" v-model.number.lazy="beneficiary.benefited_ratio" placeholder="请填写受益份额(%)">
          <div slot="icon" v-show="beneficiary.benefited_ratio != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="beneficiary.benefited_ratio = ''"></i></div>
        </app-input>
        <div class="am-list-footer">
          同一受益顺序受益人的受益份额和需为 <span class="am-ft-red">100%</span>
        </div>
      </div>
    </div>
    <div class="am-list am-list-6lb form" v-if="anti_money">
      <div class="am-list-body">
        <app-select label="国籍" :readonly="beneficiary.document_type != 3">
          <select v-model="beneficiary.nationality" v-if="init" :disabled="beneficiary.document_type != 3">
            <option disabled>请选择</option>
            <option v-for="type in init.applicant.nationality" :value="type.bs_id">{{type.explain}}</option>
          </select>
        </app-select>
        <app-input label="通讯地址">
          <input slot="input" v-model.trim="beneficiary.address_select" type="text" placeholder="请点击选择" @click="$refs.address.show=true">
          <template slot="icon">
            <div v-show="beneficiary.address_select != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearAddress"></i></div>
            <div class="am-list-button" @click="sameAddress">
              <button type="button">同投保人</button>
            </div>
          </template>
        </app-input>
        <div class="am-list-item">
          <div class="am-list-label tar app-color-warn">详细地址</div>
          <div class="am-list-control">
            <input v-model.lazy.trim="beneficiary.address" type="text" placeholder="请填写详细通讯地址">
          </div>
          <div slot="icon" v-show="beneficiary.address != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="beneficiary.address = ''"></i></div>
        </div>
        <app-input label="邮编">
          <input slot="input" v-model.lazy="beneficiary.zipcode" type="text" @change="checkZipcode" placeholder="请填写受益人邮编">
          <template slot="icon">
            <div v-show="beneficiary.zipcode != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="beneficiary.zipcode = ''"></i></div>
            <div class="am-list-button" @click="sameZipcode">
              <button type="button">同投保人</button>
            </div>
          </template>
        </app-input>
        <app-input label="手机号码">
          <input slot="input" @change="checkPhone" v-model.number.lazy="beneficiary.tel" type="number" placeholder="请填写受益人手机号码">
          <div slot="icon" v-show="beneficiary.tel != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="beneficiary.tel = ''"></i></div>
        </app-input>
        <app-input label="固定电话">
          <input slot="input" @change="checkTel" v-model.lazy.trim="beneficiary.visit_tel" type="text" placeholder="请填写受益人固定电话">
          <div slot="icon" v-show="beneficiary.visit_tel != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="beneficiary.visit_tel = ''"></i></div>
        </app-input>
        <app-input label="职业">
          <input slot="input" v-model="beneficiary.occupation" placeholder="请选择职业" type="text" @click="$refs.occupation.show = true">
          <div slot="icon" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearOccupation"></i></div>
        </app-input>
        <!-- 职业 -->
        <app-occupation ref="occupation"></app-occupation>
        <!-- 职业 -->
      </div>
    </div>
    <!-- 通讯地址 -->
    <app-region ref="address" v-on:regionselect="address_selected"></app-region>
    <!-- 通讯地址 -->
  </section>
</template>
<script>
import Api from '../api'
// 区域选择器
import Region from './Region'
import Occupation from './Occupation'
const IDValidator = require('id-validator')
export default {
  name: 'Beneficiary',
  props: ['people', 'index'],
  components: {
    'app-region': Region,
    'app-occupation': Occupation
  },
  data() {
    return {
      same: false, //同受益人
      longTerm: false, //长期有效
      // 受益人信息
      beneficiary: {
        register_select: '', //户籍展示
        address_select: '', //通信展示
        name: '', //姓名
        sex: 15, //性别
        nationality: 63, //国籍
        register: '', //户籍
        birthday: '', //出生日期

        benefited_ratio: (100 / (this.index + 1)).toFixed(0), //受益比例
        benefited_level: '1', //受益顺序
        // 证件
        document_type: '1', //证件类型
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
        occupation_code: '', //职业代码

        visit_tel: '', //回访电话
        tel: '', //联系电话
        relationship: '' //关系
      }
    }
  },
  computed: {
    init() {
      return this.$store.state.init
    },
    count() {
      return this.$store.state.tmp.people.length //人数
    },
    crt() {
      return this.$store.state.tmp.current //当前受益人
    },
    warranty() {
      return this.$store.state.warranty
    },
    anti_money() {
      //单次投保达到反洗钱标准（年交保费*交费年期≥20万元）
      return this.$store.state.anti_money
    }
  },
  created() {
    var vm = this
    vm.$on('save', function() {
      vm.$parent.beneficiaries[vm.people] = vm.beneficiary
    })
  },
  watch: {
    longTerm(val) {
      this.beneficiary.document_term = val ? '9999-12-30' : ''
    },
    same(val) {
      const vm = this
      if (val) {
        var applicant = Api.obj2json(this.$store.state.applicant)
        vm.beneficiary.document_number = applicant.document_number
        vm.beneficiary.document_type = applicant.document_type
        vm.beneficiary.document_term = applicant.document_term
        vm.beneficiary.name = applicant.name
        vm.beneficiary.sex = applicant.sex
        vm.beneficiary.birthday = applicant.birthday
        if ([18, 19, 20, 23].indexOf(vm.warranty.is_assured) > 0) {
          vm.beneficiary.relationship = vm.warranty.is_assured
        }
        if (this.$store.state.anti_money) {
          vm.beneficiary.nationality = applicant.nationality
          vm.beneficiary.province = applicant.province
          vm.beneficiary.city = applicant.city
          vm.beneficiary.district = applicant.district
          vm.beneficiary.address = applicant.address
          vm.beneficiary.zipcode = applicant.zipcode
          vm.beneficiary.occupation = applicant.occupation
          vm.beneficiary.occupation_code = applicant.occupation_code
          vm.beneficiary.visit_tel = applicant.visit_tel
          vm.beneficiary.tel = applicant.tel
        }
      } else {
        vm.beneficiary.document_number = ''
        vm.beneficiary.document_type = ''
        vm.beneficiary.document_term = ''
        vm.longTerm = 'false'
        vm.beneficiary.name = ''
        vm.beneficiary.birthday = ''
        if (this.$store.state.anti_money) {
          vm.beneficiary.nationality = ''
          vm.beneficiary.province = ''
          vm.beneficiary.city = ''
          vm.beneficiary.district = ''
          vm.beneficiary.address = ''
          vm.beneficiary.zipcode = ''
          vm.beneficiary.occupation = ''
          vm.beneficiary.occupation_code = ''
          vm.beneficiary.visit_tel = ''
          vm.beneficiary.tel = ''
        }
      }
    }
  },
  methods: {
    sameZipcode() {
      this.beneficiary.zipcode = JSON.parse(JSON.stringify(this.$store.state.applicant.zipcode))
    },
    sameAddress() {
      var applicant = JSON.parse(JSON.stringify(this.$store.state.applicant))
      this.beneficiary.address = applicant.address
      this.beneficiary.province = applicant.province
      this.beneficiary.city = applicant.city
      this.beneficiary.district = applicant.district
      this.beneficiary.address_select = applicant.address_select
      this.$refs.address.show = false
    },
    del() {
      this.$store.commit('delBeneficiary', this.people)
      this.$delete(this.$parent.beneficiaries, this.people)
      this.$toast.open('删除成功', 'success')
    },
    // 检查ID是否有效
    IDValidate() {
      const vm = this;
      const type = vm.beneficiary.document_type
      const id = vm.beneficiary.document_number
      var toast_text = null

      switch (type) {
        case '5': // 户口簿
        case '1': // 身份证
          const Validator = new IDValidator();
          const addr = this.$store.state.addr

          if (Validator.isValid(id, 18)) {
            const idInfo = Validator.getInfo(id)
            const code = idInfo.addrCode.substr(0, 2)
            const sex = { // 0为女，1为男
              1: 15,
              0: 16
            }
            vm.beneficiary.nationality = 63
            vm.beneficiary.birthday = idInfo.birth
            vm.beneficiary.sex = sex[idInfo.sex]
            vm.beneficiary.register_select = addr[code].name
            vm.beneficiary.register = addr[code].bs_id
          } else {
            toast_text = '请输入18位正确格式的身份证'
            vm.beneficiary.register_select = ''
            vm.beneficiary.birthday = ''
          }
          break;
        case '3': // 护照
          if (id.length <= 3) {
            toast_text = '护照必须是大于3位'
          }
          break;
        case '2': // 军官证
          if (id.length > 18 || id.length < 10) {
            toast_text = '军官证必须是10-18位'
          }
          break;
        case '7': //港澳
          if (id.length <= 8) {
            toast_text = '港澳居民来往内地通行证号码必须大于8位'
          }
          break;
        case '6': //台湾
          if (id.length < 8) {
            toast_text = '台湾居民来往大陆通行证号码必须大于等于8位'
          }
          break;
        default:
          break;
      }
      if (toast_text) {
        vm.$toast.open(toast_text, '')
        return false
      }
      return true
    },
    // 校验表单
    checkForm() {
      const vm = this
      var toast_text = null
      let sb = vm.count > 1 ? '第 ' + (vm.index + 1) + ' 个' : ''
      if (!vm.beneficiary.name) {
        toast_text = '请填写' + sb + '受益人【姓名】'
      } else if (!vm.beneficiary.document_number) {
        toast_text = '请填写' + sb + '受益人【证件号码】'
      } else if (vm.longTerm == false && (!vm.beneficiary.document_term || vm.beneficiary.document_term == '0000-00-00')) {
        toast_text = '请填写' + sb + '受益人【证件有效期】'
      } else if (!vm.beneficiary.sex) {
        toast_text = '请选择' + sb + '受益人【性别】'
      } else if (!vm.beneficiary.birthday) {
        toast_text = '请填写' + sb + '受益人【出生日期】'
      } else if (!vm.beneficiary.relationship) {
        toast_text = '请选择' + sb + '受益人【是被保险人的】'
      } else if (!vm.beneficiary.benefited_level) {
        toast_text = '请选择' + sb + '受益人【受益顺序】'
      } else if (!vm.beneficiary.benefited_ratio) {
        toast_text = '请填写' + sb + '受益人【受益比例】'
      } else if (vm.anti_money) {
        if (!vm.beneficiary.nationality) {
          toast_text = '请选择' + sb + '受益人【国籍】'
        } else if (!vm.beneficiary.province) {
          toast_text = '请选择' + sb + '受益人【通讯地址省份】'
        } else if (!vm.beneficiary.city && vm.beneficiary.province != '138') {
          toast_text = '请选择' + sb + '受益人【通讯地址市区】'
        } else if (!vm.beneficiary.district && vm.beneficiary.province != '138' && vm.beneficiary.city != '13643') {
          toast_text = '请选择' + sb + '受益人【通讯地址县/区】'
        } else if (!vm.beneficiary.address) {
          toast_text = '请填写' + sb + '受益人【详细地址】'
        } else if (!vm.beneficiary.zipcode && !vm.checkZipcode()) {
          toast_text = '请填写' + sb + '受益人【通信邮编】'
        } else if (!vm.beneficiary.tel && !vm.beneficiary.visit_tel) {
          toast_text = '请填写' + sb + '受益人【手机号码】或【固定电话】其一'
        } else if (vm.beneficiary.tel && !vm.checkPhone()) {
          return false
        } else if (vm.beneficiary.visit_tel && !vm.checkTel()) {
          return false
        } else if (!vm.beneficiary.occupation_code) {
          toast_text = '请填写' + sb + '受益人【职业】'
        }
      }
      if (toast_text) {
        console.info(toast_text)
        vm.$toast.open(toast_text, '')
        return false
      }
      return vm.IDValidate()
    },
    // 电话校验
    checkTel() {
      if (!/^0\d{10,11}$/.test(this.beneficiary.visit_tel)) {
        this.$toast.open('电话以0开头,格式为区号+号码,如:01012345678', '')
        return false
      }
      return true
    },
    // 手机校验
    checkPhone() {
      const tel = this.beneficiary.tel
      var toast_text = null
      if (this.beneficiary.document_type == '7' && !/^1[3|4|5|7|8][0-9]{9}$|^00852[0-9]{8}$/.test(tel)) {
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
    // 邮编校验
    checkZipcode() {
      if (!/^[0-9]\d{5}(?!\d)$/.test(this.beneficiary.zipcode)) {
        this.$toast.open('请输入6位数字邮编', 'warn')
        return false
      }
      return true
    },
    // 通讯地址选择
    address_selected(selected) {
      var vm = this
      var select_show = ''
      select_show += selected[0].explain
      vm.$set(vm.beneficiary, 'province', selected[0].if_id)
      if (selected[1]) {
        select_show += selected[1].explain
        vm.$set(vm.beneficiary, 'city', selected[1].if_id)
      }
      if (selected[2]) {
        select_show += selected[2].explain
        vm.$set(vm.beneficiary, 'district', selected[2].if_id)
        Api.queryZipcode(selected[2].code, response => {
          if (!response) {
            Api.queryZipcode(selected[1].code, response => {
              if (!response) return
              vm.$set(vm.beneficiary, 'zipcode', response)
            })
            return
          }
          vm.beneficiary.zipcode = response
        })
      }
      vm.$set(vm.beneficiary, 'address_select', select_show)
    },
    // 清除通讯地址
    clearAddress() {
      this.beneficiary.province = ''
      this.beneficiary.city = ''
      this.beneficiary.district = ''
      this.beneficiary.address_select = ''
      this.$refs.address.show = true
    },
    // 设置职业
    setOccupation(selected) {
      console.log(selected)
      this.$set(this.beneficiary, 'occupation_code', selected.bs_id)
      this.$set(this.beneficiary, 'occupation', selected.explain)
    },
    // 清除职业
    clearOccupation() {
      this.$set(this.beneficiary, 'occupation_code', '')
      this.$set(this.beneficiary, 'occupation', '')
      this.$refs.occupation.show = true
    }
  }
}
</script>
