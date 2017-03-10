<template>
  <section id="Beinsured">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header"><span class="app-iconfont">&#xe631;</span>被保险人信息</div>
      <div class="am-list-body">
        <app-input label="姓名" require="true">
          <input slot="input" v-model.lazy.trim="assured.name" type="text" placeholder="请填写被保险人姓名">
          <div slot="icon" v-show="assured.name != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.name = ''"></i></div>
        </app-input>
        <app-select label="证件类型">
          <select v-model="assured.document_type" v-if="init" @change="assured.document_number = ''">
            <option disabled>请选择证件类型</option>
            <option v-for="item in init.assured.document_type" :value="item.bs_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="证件号码">
          <input slot="input" @change="checkID" v-model.lazy="assured.document_number" type="text" placeholder="请填写被保险人证件号码">
          <div slot="icon" v-show="assured.document_number != ''" class="am-list-clear" @click="assured.document_number = ''"><i class="am-icon-clear am-icon"></i></div>
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
          <div class="am-list-control">
            <input v-model="assured.document_term" type="date" placeholder="请填写证件有效期">
          </div>
          <div v-show="assured.document_term" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.document_term = ''"></i></div>
        </div>
        <app-input label="性别">
          <div class="am-ft-right" slot="input">
            <div class="am-switch am-sex">
              <input type="checkbox" class="am-switch-checkbox" :disabled="assured.document_type == 1 || assured.document_type == 5" id="sex" v-model="assured.sex" :true-value="15" :false-value="16">
              <label class="am-switch-label" for="sex">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
        </app-input>
        <app-input label="出生日期">
          <input slot="input" :readonly="assured.document_type == 1 || assured.document_type == 5" v-model="assured.birthday" type="date" placeholder="请填写被保险人出生日期">
          <div slot="icon" v-if="assured.document_type != 1 && assured.document_type != 5" v-show="assured.birthday" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.birthday = ''"></i></div>
        </app-input>
      </div>
    </div>
    <div class="am-list am-list-6lb form">
      <div class="am-list-body">
        <app-select label="国籍" :readonly="assured.document_type != 3">
          <select v-model="assured.nationality" v-if="init" :disabled="assured.document_type != 3">
            <option disabled>请选择国籍</option>
            <option v-for="item in init.assured.nationality" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="户籍">
          <input slot="input" readonly v-model="assured.register_select" type="text" placeholder="请选择被保险人户籍" @click="clearRegister">
          <div slot="icon" v-show="assured.register_select != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearRegister"></i></div>
        </app-input>
        <!-- 户籍 -->
        <app-region v-if="init" v-show="!assured.register" :level="1" :label="register_selected_label" :provinces="init.assured.province" v-on:regionselect="register_selected"></app-region>
        <app-input label="通讯地址">
          <input slot="input" readonly v-model="assured.address_select" type="text" placeholder="请在下方选择和填写" @click="clearAddress">
          <div slot="icon" v-show="assured.address_select != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearAddress"></i></div>
        </app-input>
        <!-- 通讯地址 -->
        <app-region ref="address" v-if="init" :provinces="init.assured.province" :label="address_selected_label" v-on:regionselect="address_selected"></app-region>
        <!-- 通讯地址 -->
        <app-input label="详细地址">
          <input slot="input" v-model.trim="assured.address" type="text" placeholder="请填写详细通讯地址">
          <div slot="icon" v-show="assured.address != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.address = ''"></i></div>
        </app-input>
      </div>
    </div>
    <div class="am-list am-list-6lb form">
      <div class="am-list-body">
        <app-input label="邮编">
          <input slot="input" @change="checkZipcode" maxlength="6" v-model.lazy.number="assured.zipcode" type="number" placeholder="请填写被保险人邮编">
          <div slot="icon" v-show="assured.zipcode != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.zipcode = ''"></i></div>
        </app-input>
        <app-input label="手机号码(选填)">
          <input slot="input" @change="checkPhone" v-model.lazy="assured.tel" type="text" placeholder="请填写被保险人手机号码">
          <div slot="icon" v-show="assured.tel != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.tel = ''"></i></div>
        </app-input>
        <app-input label="工作单位(选填)">
          <input slot="input" v-model.trim="assured.work_unit" type="text" placeholder="请填写被保险人工作单位">
          <div slot="icon" v-show="assured.work_unit != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.work_unit = ''"></i></div>
        </app-input>
        <app-input label="年收入(万元)">
          <input slot="input" @change="assured.annual_earnings >= 1000000 ? ($toast.open('数值超出范围，请确认单位为万元','warn'),assured.annual_earnings=''):''" v-model.number.lazy="assured.annual_earnings" type="number" placeholder="请填写年收入(万元)">
          <div slot="icon" v-show="assured.annual_earnings != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.annual_earnings = ''"></i></div>
        </app-input>
        <app-select label="收入来源">
          <select v-model.number="assured.annual_source">
            <option disabled>请选择收入来源</option>
            <option value="1">工薪</option>
            <option value="2">个体</option>
            <option value="3">私营</option>
            <option value="4">房屋出租</option>
            <option value="5">证券投资</option>
            <option value="6">银行利息</option>
            <option value="7">其他</option>
          </select>
        </app-select>
        <app-input label="" v-show="assured.annual_source == 7">
          <input slot="input" v-model="assured.annual_source_other" type="text" placeholder="请填写收入来源">
          <div slot="icon" v-show="assured.annual_source_other != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.annual_source_other = ''"></i></div>
        </app-input>
        <app-input label="身高">
          <input slot="input" v-model.number="assured.height" type="number" placeholder="请填写身高(cm)">
          <div slot="icon" v-show="assured.height != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.height = ''"></i></div>
        </app-input>
        <app-input label="体重">
          <input slot="input" v-model.number="assured.weight" type="number" placeholder="请填写体重(Kg)">
          <div slot="icon" v-show="assured.weight != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="assured.weight = ''"></i></div>
        </app-input>
        <app-input label="职业">
          <input slot="input" v-model="assured.occupation" placeholder="请在下方选择职业" type="text" readonly @click="clearOccupation">
          <div slot="icon" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearOccupation"></i></div>
        </app-input>
        <!-- 职业 -->
        <div class="am-list-item dropdown" v-if="init" v-show="occupation_selected_label != '重新选择'">
          <div class="am-list-dropdown-main">
            <div class="am-list-label tar app-color-warn">{{occupation_selected_label}}:</div>
            <div class="am-list-control">
              <select id="occupation" v-model="assured.occupation_select" @change="occupation_changed">
                <option disabled>请选择</option>
                <option v-for="item in occupations" :value="item.explain+'|'+item.code+'|'+item.if_id">{{item.explain}}</option>
              </select>
            </div>
            <div class="am-list-arrow"><span class="am-icon arrow vertical"></span></div>
          </div>
        </div>
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
import Api from '../api'
// 区域选择器
import Region from '../components/Region'

export default {
  name: 'beinsured',
  components: {
    'app-region': Region
  },
  data() {
    return {
      register_selected_label: ['请选择省'],
      address_selected_label: ['请选择省'],
      occupation_selected_label: '请选择',
      longTerm: false, //是否长期有效
      occupations: null, //职业数据
      // 被保险人信息
      assured: {
        register_select: '', //户籍展示
        address_select: '', //通信展示
        occupation_select: '', //职业展示
        name: '', //姓名
        sex: '', //性别
        height: '', //身高(厘米)
        weight: '', //体重(kg)
        nationality: 63, //国籍
        register: '', //户籍
        annual_earnings: '', //年收入
        annual_source: '', //收入来源
        annual_source_other: '', //其他收入来源
        birthday: '', //出生日期
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

        work_unit: '', //工作单位
        visit_tel: '', //回访电话
        tel: '' //联系电话
      },
      // 保单信息
      warranty: {
        assured_occupation_code: '' //职业代码
      }
    }
  },
  computed: {
    init() {
      this.$store.state.init && (this.occupations = JSON.parse(JSON.stringify(this.$store.state.init.applicant.occupation_code)))
      return this.$store.state.init
    }
  },
  watch: {
    longTerm(val) {
      this.assured.document_term = val ? '9999-12-30' : ''
    }
  },
  methods: {
    // 证件号码校验
    checkID() {
      this.IDValidate() && this.checkIDExist()
    },
    // 检查ID是否有效
    IDValidate() {
      const vm = this;
      const type = vm.assured.document_type
      const id = vm.assured.document_number
      var toast_text = null

      switch (type) {
        case '5': // 户口簿
        case '1': // 身份证
          const IDValidator = require('id-validator')
          const Validator = new IDValidator();
          const addr = this.$store.state.addr

          if (Validator.isValid(id, 18)) {
            const idInfo = Validator.getInfo(id)
            const code = idInfo.addrCode.substr(0, 2)
            const sex = { // 0为女，1为男
              1: 15,
              0: 16
            }
            vm.assured.nationality = 63
            vm.assured.birthday = idInfo.birth
            vm.assured.sex = sex[idInfo.sex]
            vm.assured.register_select = addr[code].name
            vm.assured.register = addr[code].if_id

            const age = new Date().getFullYear() - vm.assured.birthday.substr(0, 4)
            if (age < 16) {
              vm.assured.annual_earnings = 0 //小于16周岁默认为0，可修改
              vm.assured.annual_source = 7
              vm.assured.annual_source_other = '无'
            }
          } else {
            toast_text = '请输入正确的18位数证件号码'
            vm.assured.register_select = ''
            vm.assured.birthday = ''
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
      }
      if (toast_text) {
        vm.$toast.open(toast_text, '')
        return false
      }
      return true
    },
    // 检查ID是否存在
    checkIDExist() {
      const vm = this
      const id = vm.assured.document_number
      Api.queryID(id, 'assured', res => {
        if (!res) {
          vm.assured.assu_id && (delete vm.assured.assu_id)
          return
        }
        var assured = {}
        if (res.ChPro && res.ChCity && res.ChDistrict) {
          vm.address_selected_label = ['重新选择']
          assured.province = res.province
          assured.city = res.city
          assured.district = res.district
          assured.address = res.address
          assured.address_select = res.ChPro + res.ChCity + res.ChDistrict
        }
        assured.annual_earnings = res.annual_earnings
        assured.annual_source = res.annual_source
        assured.annual_source_other = res.annual_source_other
        assured.assu_id = res.assu_id
        assured.document_term = res.document_term
        if (res.document_term == '9999-12-30') this.longTerm = true
        assured.height = res.height
        assured.weight = res.weight
        assured.name = res.name
        if (res.occupation_code) {
          vm.occupation_selected_label = '重新选择'
          assured.occupation = res.occupation
          assured.occupation_code = res.occupation_code
          vm.warranty.assured_occupation_code = res.occupation_code
        }
        assured.register = res.register
        assured.tel = res.tel
        assured.visit_tel = res.visit_tel
        assured.work_unit = res.work_unit
        assured.zipcode = res.zipcode
        vm.assured = Object.assign(vm.assured, assured)
      })
    },
    // 户籍选择
    register_selected(a, p, c, d) {
      this.assured.register = p.if_id
      this.assured.register_select = a
    },
    // 清除户籍
    clearRegister() {
      this.assured.register = ''
      this.assured.register_select = ''
      this.register_selected_label = ['请选择省']
    },
    // 通讯地址选择
    address_selected(a, p, c, d) {
      this.assured.address_select = a
      this.assured.province = p.if_id
      this.assured.city = c.if_id
      this.assured.district = d.if_id
    },
    // 清除通讯地址
    clearAddress() {
      this.assured.address = ''
      this.assured.province = ''
      this.assured.city = ''
      this.assured.district = ''
      this.assured.address_select = ''
      this.address_selected_label = ['请选择省']
    },
    // 邮编校验
    checkZipcode() {
      if (!/^[1-9]\d{5}(?!\d)$/.test(this.assured.zipcode)) {
        this.$toast.open('请输入6位数字邮编', 'warn')
        return false
      }
      return true
    },
    // 手机校验
    checkPhone() {
      const tel = this.assured.tel
      var toast_text = null
      if (this.assured.document_type == '7' && !/^1[3|4|5|7|8][0-9]{9}$|^00852[0-9]{8}$/.test(tel)) {
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
    // 清除职业
    clearOccupation() {
      this.warranty.assured_occupation_code = ''
      this.occupation_selected_label = '请选择'
      this.assured.occupation_select = ''
      this.occupations = JSON.parse(JSON.stringify(this.init.assured.occupation_code))
    },
    // 职业选择
    occupation_changed() {
      this.warranty.assured_occupation_code = ''
      this.assured.occupation = ''
      if (!this.assured.occupation_select) return
      const selected = this.assured.occupation_select.split('|')
      this.getOccupation(selected[2], selected[0])
      this.$toast.open('', 'loading')
    },
    // 获取地址数据
    getOccupation(if_id, explain) {
      const vm = this
      Api.queryOccupation(if_id, data => {
        this.$toast.open(null, null)
        if (data.length < 1) {
          vm.occupation_selected_label = '重新选择'
          vm.occupations = JSON.parse(JSON.stringify(vm.init.assured.occupation_code))
          vm.warranty.assured_occupation_code = if_id
          vm.assured.occupation = explain
          vm.assured.occupation_code = if_id
        } else {
          vm.occupation_selected_label = '请继续选择'
          vm.occupations = data
        }
      })
    },
    // 校验表单
    checkForm() {
      const vm = this
      var toast_text = null
      if (!vm.assured.name) {
        toast_text = '请填写被保险人【姓名】'
      } else if (!vm.assured.document_number) {
        toast_text = '请填写被保险人【证件号码】'
      } else if (vm.longTerm == false && (!vm.assured.document_term || vm.assured.document_term == "0000-00-00")) {
        toast_text = '请填写被保险人【证件有效期】'
      } else if (!vm.assured.sex) {
        toast_text = '请选择被保险人【性别】'
      } else if (!vm.assured.birthday) {
        toast_text = '请选择被保险人【出生日期】'
      } else if (!vm.assured.nationality) {
        toast_text = '请选择被保险人【国籍】'
      } else if (!vm.assured.register) {
        toast_text = '请选择被保险人【户籍】'
      } else if (!vm.assured.province) {
        toast_text = '请选择被保险人【通讯地址省份】'
      } else if (!vm.assured.city) {
        toast_text = '请选择被保险人【通讯地址市区】'
      } else if (!vm.assured.district) {
        toast_text = '请选择被保险人【通讯地址县/区】'
      } else if (!vm.assured.address) {
        toast_text = '请填写被保险人【详细地址】'
      } else if (!vm.assured.zipcode) {
        toast_text = '请填写被保险人【通信邮编】'
      } else if (vm.assured.annual_earnings === '') {
        toast_text = '请填写被保险人【年收入】'
      } else if (vm.assured.annual_earnings < 0) {
        toast_text = '请填写正确的年收入值'
      } else if (!vm.assured.height) {
        toast_text = '请填写被保险人【身高】'
      } else if (!vm.assured.weight) {
        toast_text = '请填写被保险人【体重】'
      } else if (!vm.warranty.assured_occupation_code) {
        toast_text = '请填写被保险人【职业】'
      }
      if (toast_text) {
        console.info(toast_text)
        this.$toast.open(toast_text, '')
        return false
      }
      return this.IDValidate() && this.checkZipcode()
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == '/insured') {
      next()
      return false
    }
    if (!this.checkForm()) {
      return false
    }
    if (this.assured.annual_source != 7) {
      this.$delete(this.assured, 'annual_source_other')
    }
    this.$store.commit('saveAssured', this.assured)
    this.$store.commit('setWarranty', this.warranty)
    next()
  }
}
</script>
