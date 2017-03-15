<template>
  <section id="Insured">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header"><span class="app-iconfont">&#xe631;</span>投保人信息</div>
      <div class="am-list-body">
        <app-input label="姓名" require="true">
          <input slot="input" v-model.lazy.trim="applicant.name" type="text" placeholder="请填写投保人姓名">
          <div slot="icon" v-show="applicant.name != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.name = ''"></i></div>
        </app-input>
        <app-select label="证件类型">
          <select v-model="applicant.document_type" v-if="init" @change="applicant.document_number = ''">
            <option disabled>请选择证件类型</option>
            <option v-if="item.bs_id != 4" v-for="item in init.applicant.document_type" :value="item.bs_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="证件号码">
          <input slot="input" @change="checkID" v-model.lazy="applicant.document_number" type="text" placeholder="请填写投保人证件号码">
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
          <div class="am-list-control">
            <input :readonly="longTerm" v-model="applicant.document_term" type="date" placeholder="请填写证件有效期">
          </div>
          <div v-show="applicant.document_term" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.document_term = ''"></i></div>
        </div>
        <app-input label="性别">
          <div class="am-ft-right" slot="input">
            <div class="am-switch am-sex">
              <input type="checkbox" class="am-switch-checkbox" for="sex" :disabled="applicant.document_type == 1 || applicant.document_type == 5" v-model="applicant.sex" :true-value="15" :false-value="16">
              <label class="am-switch-label" for="sex">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
        </app-input>
        <app-input label="出生日期">
          <input slot="input" :readonly="applicant.document_type == 1 || applicant.document_type == 5" v-model="applicant.birthday" type="date" placeholder="请填写投保人出生日期">
          <div slot="icon" v-if="applicant.document_type != 1 && applicant.document_type != 5" v-show="applicant.birthday" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.birthday = ''"></i></div>
        </app-input>
      </div>
    </div>
    <div class="am-list am-list-6lb form">
      <div class="am-list-body">
        <app-select label="国籍" :readonly="applicant.document_type != 3">
          <select v-model="applicant.nationality" v-if="init" :disabled="applicant.document_type != 3">
            <option disabled>请选择国籍</option>
            <option v-for="item in init.applicant.nationality" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="户籍">
          <input slot="input" readonly v-model="applicant.register_select" type="text" placeholder="请选择投保人户籍" @click="clearRegister">
          <div slot="icon" v-show="applicant.register_select != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearRegister"></i></div>
        </app-input>
        <!-- 户籍 -->
        <app-region v-if="init" v-show="!applicant.register" :level="1" :label="register_selected_label" :provinces="init.applicant.province" v-on:regionselect="register_selected"></app-region>
        <app-input label="通讯地址">
          <input slot="input" readonly v-model="applicant.address_select" type="text" placeholder="请在下方选择和填写" @click="clearAddress">
          <div slot="icon" v-show="applicant.address_select != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearAddress"></i></div>
        </app-input>
        <app-region ref="address" v-if="init" :provinces="init.applicant.province" :label="address_selected_label" v-on:regionselect="address_selected"></app-region>
        <div class="am-list-item">
          <div class="am-list-label tar app-color-warn">详细地址</div>
          <div class="am-list-control">
            <input v-model.trim="applicant.address" type="text" placeholder="请填写详细通讯地址">
          </div>
          <div slot="icon" v-show="applicant.address != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.address = ''"></i></div>
        </div>
        <!-- 通讯地址 -->
      </div>
    </div>
    <div class="am-list am-list-6lb form">
      <div class="am-list-body">
        <app-input label="邮编">
          <input slot="input" @change="checkZipcode" maxlength="6" v-model.lazy.number="applicant.zipcode" type="number" placeholder="请填写投保人邮编">
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
          <input slot="input" v-model.trim="applicant.work_unit" type="text" placeholder="请填写投保人工作单位">
          <div slot="icon" v-show="applicant.work_unit != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.work_unit = ''"></i></div>
        </app-input>
        <app-input label="年收入(万元)">
          <input slot="input" @change="applicant.annual_earnings >= 1000000 ? ($toast.open('数值超出范围，请确认单位为万元','warn'),applicant.annual_earnings=''):''" v-model.number.lazy="applicant.annual_earnings" type="number" placeholder="请填写年收入(万元)">
          <div slot="icon" v-show="applicant.annual_earnings != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.annual_earnings = ''"></i></div>
        </app-input>
        <app-select label="收入来源">
          <select v-model.number="applicant.annual_source">
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
        <app-input label="" v-show="applicant.annual_source ==7">
          <input slot="input" v-model="applicant.annual_source_other" type="text" placeholder="请填写收入来源">
          <div slot="icon" v-show="applicant.annual_source_other != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.annual_source_other = ''"></i></div>
        </app-input>
        <app-input label="身高">
          <input slot="input" v-model.number="applicant.height" type="number" placeholder="请填写身高(cm)">
          <div slot="icon" v-show="applicant.height != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.height = ''"></i></div>
        </app-input>
        <app-input label="体重">
          <input slot="input" v-model.number="applicant.weight" type="number" placeholder="请填写体重(Kg)">
          <div slot="icon" v-show="applicant.weight != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="applicant.weight = ''"></i></div>
        </app-input>
        <app-select label="是被保险人的">
          <select v-model="warranty.is_assured" v-if="init">
            <option disabled>请选择</option>
            <option v-for="item in init.warranty.is_assured" :value="item.bs_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="" v-show="warranty.is_assured == 22">
          <input slot="input" v-model="warranty.is_assured_val" type="text" placeholder="请填写是被保险人的">
          <div slot="icon" @click="warranty.is_assured_val = ''" v-show="warranty.is_assured_val != ''" class="am-list-clear"><i class="am-icon-clear am-icon"></i></div>
        </app-input>
        <app-input label="职业">
          <input slot="input" v-model="applicant.occupation" placeholder="请选择职业" type="text" readonly @click="showOccupation = true">
          <div slot="icon" v-show="applicant.occupation" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearOccupation"></i></div>
        </app-input>
        <!-- 职业 -->
        <app-select label="合同争议处理方式">
          <select v-model="warranty.contract_handle" v-if="init">
            <option disabled>请选择</option>
            <option v-for="item in init.warranty.contract_handle" :value="item.if_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="仲裁委员会" v-show="warranty.contract_handle == 109">
          <input slot="input" v-model="warranty.contract_handle_value" type="text" placeholder="请填写仲裁委员会名称">
          <div slot="icon" v-show="warranty.contract_handle_value != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="warranty.contract_handle_value = ''"></i></div>
        </app-input>
      </div>
    </div>
    <div class="am-tab am-fixed am-fixed-bottom app-navi">
      <router-link to="/" class="am-tab-item">上一步</router-link>
      <a @click="next" class="am-tab-item selected">下一步</a>
    </div>
    <div class="am-dialog show app-dialog" v-show="showOccupation">
      <div class="am-dialog-wrap">
        <div class="am-dialog-header" slot="header">
          <h3 slot="header">职业</h3>
        </div>
        <div class="am-dialog-body" slot="body">
          <div class="am-list form">
            <div class="am-list-header am-ft-left">选择职业</div>
            <div class="am-list-body">
              <div class="am-list-item">
                <div class="am-list-label">{{occupation_selected_label}}</div>
                <div class="am-list-control">
                  <select id="occupation" v-model="applicant.occupation_select" @change="occupation_changed">
                    <option disabled>请选择</option>
                    <option v-for="item in occupations" :value="item.explain+'|'+item.code+'|'+item.if_id">{{item.explain}}</option>
                  </select>
                </div>
                <div class="am-list-arrow"><span class="am-icon arrow vertical"></span></div>
              </div>
            </div>
          </div>
          <div class="am-search-inpage">
            <div class="am-search-input">
              <input class="am-search-value" v-model.lazy="keyword" type="text" placeholder="或输入职业关键词" @keyup.enter="queryOccupation">
              <div class="am-search-clear" @click="keyword = ''" v-show="keyword !=''">
                <i class="am-icon-clear am-icon clear-tiny"></i>
              </div>
              <div class="am-search-icon" @click="queryOccupation">
                <i class="am-icon search-inpage"></i>
              </div>
            </div>
          </div>
          <div class="am-list" v-if="OccupationResult.length">
            <div class="am-list-header am-ft-left">搜索结果</div>
            <div class="am-list-body">
              <label class="am-list-item" v-for="item,index in OccupationResult" @click="selectOccupation(item)">
                <div class="am-list-content">{{index+1}}.{{item.explain}}</div>
              </label>
            </div>
          </div>
          <div class="am-list" v-else v-show="commonOccupation.length > 0">
            <div class="am-list-header am-ft-left">常见职业</div>
            <div class="am-list-body">
              <label class="am-list-item" v-for="item,index in commonOccupation" @click="selectOccupation(item)">
                <div class="am-list-content">{{index+1}}.{{item.explain}}</div>
              </label>
            </div>
          </div>
        </div>
        <div class="am-dialog-footer" slot="footer">
          <button type="button" class="am-dialog-button" @click="showOccupation = false">
            关闭
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import Api from '../api'
// 区域选择器
import Region from '../components/Region'
// import Occupation from '../components/Occupation'

export default {
  name: 'Insured',
  components: {
    'app-region': Region
  },
  data() {
    return {
      longTerm: false, //是否长期有效
      register_selected_label: ['请选择省'],
      address_selected_label: ['请选择省'],
      level: 0,
      occupations: null, //职业数据
      keyword: '', // 职业搜索关键词
      showOccupation: false, //显示职业数据
      OccupationResult: [], //搜索结果
      commonOccupation: [], //常见职业
      // 投保人信息
      applicant: {
        register_select: '', //户籍展示
        address_select: '', //通信展示
        occupation_select: '', //职业展示
        name: '', //姓名
        sex: 15, //性别
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
        is_assured: '21', //是被保险人的
        is_assured_val: '', //是被保险人值

        // 职业
        applicant_occupation_code: '', //职业代码

        contract_handle: '108', //合同争议处理方式
        contract_handle_value: '' //填写仲裁委员会名称
      }
    }
  },
  computed: {
    init() {
      this.$store.state.init && (this.occupations = JSON.parse(JSON.stringify(this.$store.state.init.applicant.occupation_code)))
      return this.$store.state.init
    },
    occupation_selected_label() {
      const OccupationLevel = ['一级', '二级', '三级', '四级', '五级', '六级', '七级', '八级']
      return OccupationLevel[this.level]
    }
  },
  watch: {
    longTerm(val) {
      this.applicant.document_term = val ? '9999-12-30' : ''
    },
    applicant: {
      handler(val) {
        val.annual_source == 7 && this.$set(this.applicant, this.annual_source_other, '')
      },
      deep: true
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
      const type = vm.applicant.document_type
      const id = vm.applicant.document_number
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
            vm.applicant.nationality = 63
            vm.applicant.birthday = idInfo.birth
            vm.applicant.sex = sex[idInfo.sex]
            vm.applicant.register_select = addr[code].name
            vm.applicant.register = addr[code].if_id

            return this.checkAge()
          } else {
            toast_text = '请输入正确的18位数证件号码'
            vm.applicant.register_select = ''
            vm.applicant.birthday = ''
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
      const id = vm.applicant.document_number
      Api.queryID(id, 'applicant', res => {
        if (!res) {
          vm.applicant.appl_id && (delete vm.applicant.appl_id)
          return
        }
        if (vm.applicant.name != res.name) {
          return false
        }
        var applicant = {}
        if (res.ChPro && res.ChCity && res.ChDistrict) {
          vm.address_selected_label = ['重新选择']
          applicant.province = res.province
          applicant.city = res.city
          applicant.district = res.district
          applicant.address = res.address
          applicant.address_select = res.ChPro + res.ChCity + res.ChDistrict
        }
        applicant.annual_earnings = res.annual_earnings
        applicant.annual_source = res.annual_source
        applicant.annual_source_other = res.annual_source_other
        applicant.appl_id = res.appl_id
        applicant.document_term = res.document_term
        if (res.document_term == '9999-12-30') this.longTerm = true
        applicant.height = res.height
        applicant.weight = res.weight
        applicant.name = res.name
        if (res.occupation_code) {
          vm.level = 0
          applicant.occupation = res.occupation
          applicant.occupation_code = res.occupation_code
          vm.warranty.applicant_occupation_code = res.occupation_code
        }
        applicant.register = res.register
        applicant.tel = res.tel
        applicant.visit_tel = res.visit_tel
        applicant.work_unit = res.work_unit
        applicant.zipcode = res.zipcode
        this.$refs.address.show = false
        vm.applicant = Object.assign(vm.applicant, applicant)
      })
    },
    // 年龄验证
    checkAge() {
      const vm = this;
      const age = new Date().getFullYear() - vm.applicant.birthday.substr(0, 4)
      if (age <= 16) {
        vm.$toast.open('投保人年龄不符合规定，请更换投保人', 'error')
        vm.applicant.document_number = ''
        vm.applicant.birthday = ''
        return false
      }
      return true
    },
    // 户籍选择
    register_selected(a, p, c, d) {
      this.applicant.register = p.if_id
      this.applicant.register_select = a
    },
    // 清除户籍
    clearRegister() {
      this.applicant.register = ''
      this.applicant.register_select = ''
      this.register_selected_label = ['请选择省']
    },
    // 通讯地址选择
    address_selected(a, p, c, d) {
      this.applicant.address_select = a
      p && (this.applicant.province = p.if_id)
      c && (this.applicant.city = c.if_id)
      d && (this.applicant.district = d.if_id)
      var code = d.code ? d.code : c.code
      code && Api.queryZipcode(code, response => {
        this.applicant.zipcode = response
      })
    },
    // 清除通讯地址
    clearAddress() {
      this.applicant.address = ''
      this.applicant.province = ''
      this.applicant.city = ''
      this.applicant.district = ''
      this.applicant.address_select = ''
      this.$refs.address.province.selected = 0
      this.$refs.address.city.selected = 0
      this.$refs.address.district.selected = 0
      this.$refs.address.citys = []
      this.$refs.address.districts = []
      this.$refs.address.show = true
    },
    // 邮编校验
    checkZipcode() {
      if (!/^[1-9]\d{5}(?!\d)$/.test(this.applicant.zipcode)) {
        this.$toast.open('请输入6位数字邮编', 'warn')
        return false
      }
      return true
    },
    // 手机校验
    checkPhone() {
      const tel = this.applicant.tel
      var toast_text = null
      if (this.applicant.document_type == '7') {
        if (!/^1[3|4|5|7|8][0-9]{9}$|^00852[0-9]{8}$/.test(tel.toString())) {
          toast_text = '请输入正确的11位或13位手机号'
        }
      } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(tel)) {
        toast_text = '请输入正确的11位手机号'
      }
      if (toast_text) {
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
    // 搜索职业
    queryOccupation() {
      var vm = this
      if (!vm.keyword) {
        vm.$toast.open('关键词不能为空', 'warn')
        return
      }
      Api.searchOccupation(vm.keyword, response => {
        if (response.data.length > 0 && response.status === true) {
          vm.OccupationResult = response.data
        } else {
          vm.$toast.open('未找到', 'warn')
        }
      })
    },
    // 选择职业
    selectOccupation(item) {
      this.level = 0
      this.showOccupation = false
      this.warranty.applicant_occupation_code = item.if_id
      this.applicant.occupation = item.explain
      this.applicant.occupation_code = item.if_id
    },
    // 清除职业
    clearOccupation() {
      this.warranty.applicant_occupation_code = ''
      this.applicant.occupation_select = ''
      this.occupations = JSON.parse(JSON.stringify(this.init.applicant.occupation_code))
      this.showOccupation = true
      this.OccupationResult = []
    },
    // 职业选择
    occupation_changed() {
      this.warranty.applicant_occupation_code = ''
      this.applicant.occupation = ''
      if (!this.applicant.occupation_select) return
      const selected = this.applicant.occupation_select.split('|')
      this.getOccupation(selected[2], selected[0])
      this.$toast.open(null, 'loading')
    },
    // 获取地址数据
    getOccupation(if_id, explain) {
      const vm = this
      Api.queryOccupation(if_id, data => {
        this.$toast.open(null, null)
        if (data.length < 1) {
          vm.level = 0
          vm.showOccupation = false
          vm.occupations = JSON.parse(JSON.stringify(vm.init.applicant.occupation_code))
          vm.warranty.applicant_occupation_code = if_id
          vm.applicant.occupation = explain
          vm.applicant.occupation_code = if_id
        } else {
          vm.level += 1
          vm.occupations = data
        }
      })
    },
    // 校验表单
    checkForm() {
      const vm = this
      var toast_text = null
      if (!vm.applicant.name) {
        toast_text = '请填写投保人【姓名】'
      } else if (!vm.applicant.document_number) {
        toast_text = '请填写投保人【证件号码】'
      } else if (vm.longTerm == false && (!vm.applicant.document_term || vm.applicant.document_term == "0000-00-00")) {
        toast_text = '请填写投保人【证件有效期】'
      } else if (!vm.applicant.sex) {
        toast_text = '请选择投保人【性别】'
      } else if (!vm.applicant.birthday) {
        toast_text = '请选择投保人【出生日期】'
      } else if (!vm.applicant.nationality) {
        toast_text = '请选择投保人【国籍】'
      } else if (!vm.applicant.register) {
        toast_text = '请选择投保人【户籍】'
      } else if (!vm.applicant.province) {
        toast_text = '请选择投保人【通讯地址省份】'
      } else if (!vm.applicant.city) {
        toast_text = '请选择投保人【通讯地址市区】'
      } else if (!vm.applicant.district) {
        toast_text = '请选择投保人【通讯地址县/区】'
      } else if (!vm.applicant.address) {
        toast_text = '请填写投保人【详细地址】'
      } else if (!vm.applicant.zipcode) {
        toast_text = '请填写投保人【通信邮编】'
      } else if (!vm.applicant.tel) {
        toast_text = '请填写投保人【手机号码】'
          /*      } else if (!vm.applicant.work_unit) {
                  toast_text = '请填写投保人【工作单位】'*/
      } else if (!vm.applicant.annual_earnings) {
        toast_text = '请填写投保人【年收入】'
      } else if (!vm.applicant.annual_earnings) {
        toast_text = '请填写投保人【年收入】'
      } else if (!vm.applicant.height) {
        toast_text = '请填写投保人【身高】'
      } else if (!vm.applicant.weight) {
        toast_text = '请填写投保人【体重】'
      } else if (!vm.warranty.is_assured) {
        toast_text = '请选择投保人【是投保人的】'
      } else if (!vm.warranty.is_assured == 22) {
        toast_text = '请填写投保人【是投保人的】'
      } else if (!vm.warranty.applicant_occupation_code) {
        toast_text = '请选择投保人【职业】'
      } else if (!vm.warranty.contract_handle) {
        toast_text = '请选择【合同争议处理方式】'
      } else if (vm.warranty.contract_handle == '109' && !vm.warranty.contract_handle_value) {
        toast_text = '请填写【仲裁委员会】'
      }
      if (toast_text) {
        console.info(toast_text)
        this.$toast.open(toast_text, '')
        return false
      }
      return this.checkPhone() && this.IDValidate() && this.checkAge() && this.checkZipcode()
    },
    next() {
      if (!this.checkForm()) {
        return false
      }
      this.$toast.open('', '')
      var nextPage
      if (this.applicant.annual_source != 7) {
        this.$delete(this.applicant, 'annual_source_other')
      }
      // 如果被保险人是本人
      if (this.warranty.is_assured == '21') {
        this.warranty.assured_occupation_code = this.warranty.applicant_occupation_code
        Api.queryID(this.applicant.document_number, 'assured', res => {
          var assured = this.applicant
          if (res) {
            assured.assu_id = res.assu_id
          }
          this.$store.dispatch('saveAssured', assured)
        })
        nextPage = '/prospectus'
      } else {
        nextPage = '/beinsured'
      }
      this.$store.commit('setApplicant', this.applicant)
      this.$store.commit('setWarranty', this.warranty)
      this.$router.push(nextPage)
    }
  }
}
</script>
