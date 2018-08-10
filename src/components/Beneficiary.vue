<template>
  <section class="Beneficiary">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header fn-clear" v-if="count > 1">
        第 {{BfIndex+1}} 个受益人
        <a v-show="count > 1 && crt > 0" v-if="BfIndex>0" class="fn-right del" @click="del">删除</a>
      </div>
      <div class="am-list-body">
        <app-input label="同投保人" class="am-list-control-button" v-if="BfIndex === 0 && applicant.is_assured && applicant.is_assured !== 'LBK0001'" >
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':same}"
                  :disabled="same"
                  @click="same = !same, toblur()">是
          </button>
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':!same}"
                  :disabled="!same"
                  @click="same = !same, toblur()">否
          </button>
        </app-input>
        <template v-if="!same">
          <app-input label="姓名" >
            <input slot="input" v-model.trim="beneficiary.fullname" type="text" placeholder="请输入" @change="checkName">
            <div slot="icon" v-show="beneficiary.fullname != ''" class="am-list-clear"><i class="iconfont icon-chahao" @click="beneficiary.fullname = ''"></i></div>
          </app-input>
          <div class="am-list-item ">
            <div class="am-list-label">证件类型</div>
            <div class="am-list-control">
              <input type="text" placeholder="请选择" readonly v-model="beneficiary.ID_type_name" @click="toShow('ID')"
                     v-if="beneficiary.ID_type_name">
              <input type="text" placeholder="请选择" readonly @click="toShow('ID')" v-else>
              <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
            </div>
          </div>
          <app-input label="证件号码">
            <input slot="input" @change="IDValidate" v-model.lazy="beneficiary.ID_no" type="text" placeholder="请输入" class="uppercase">
            <div slot="icon" v-show="beneficiary.ID_no != ''" class="am-list-clear" @click="beneficiary.ID_no = ''"><i class="iconfont icon-chahao"></i></div>
          </app-input>
          <div class="am-list-item ">
            <div class="am-list-label">证件有效期</div>
            <div class="am-list-control" style="width: 70%">
              <input slot="input" :class="{'has': beneficiary.ID_expire_end != ''}" :readonly="longTerm" v-model="beneficiary.ID_expire_end" type="date" placeholder="请选择" @change="checkTerm('受益人', beneficiary.ID_expire_end )">

              <div class="am-list-clear" style="" :disabled="longTerm"><i class="iconfont icon-rili"></i></div>
            </div>
            <div  class="am-list-change orange" :class="{'changeBlue' : longTerm}" @click="longTerm=!longTerm,toblur()">
              长期有效
            </div>
          </div>
          <!--性别-->
          <app-input label="性别" class="am-list-control-button">
            <button slot="button" class="am-button tiny"
                    :class="{'tiny-blue':beneficiary.gender===item.value}"
                    v-for="(item,index) in init.gender" :disabled="beneficiary.ID_type == 'LAA0028' || beneficiary.ID_type == 'LAA0031'"
                    @click="beneficiary.gender = item.value">{{item.text}}
            </button>
          </app-input>
          <app-input label="出生日期">
            <input slot="input" :class="{'has': beneficiary.birthday !== ''}" v-model="beneficiary.birthday" :disabled="['LAA0028','LAA0031'].indexOf(beneficiary.ID_type) > -1" type="date" placeholder="请选择">
            <div slot="icon" v-show="beneficiary.birthday  && !same  && ['LAA0028','LAA0031'].indexOf(beneficiary.ID_type) === -1" class="am-list-clear"><i class="iconfont icon-chahao" @click="beneficiary.birthday = ''"></i></div>
          </app-input>
          <app-input label="是被保人的" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':beneficiary.beneficiary_is_insured===item.value}"
                  v-for="(item,index) in init.relation_beneficiary"
                  @click="beneficiary.beneficiary_is_insured = item.value">{{item.text}}
          </button>
        </app-input>
        </template>
        <app-input label="受益顺序" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':beneficiary.sort_order===item}"
                  v-for="item in 4"
                  @click="beneficiary.sort_order = item">{{item}}
          </button>
        </app-input>


        <app-input label="受益份额(%)">
          <input slot="input" type="number" v-model.number.lazy="beneficiary.rate" placeholder="请输入">
          <div slot="icon" v-show="beneficiary.rate !== ''" class="am-list-clear"><i class="iconfont icon-chahao" @click="beneficiary.rate = ''"></i></div>
        </app-input>
        <div class="am-list-footer">
          同一受益顺序受益人的受益份额和需为 <span class="am-ft-red">100%</span>
        </div>
      </div>
    </div>
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">受益人声明（备注说明）</div>
      <div class="am-list-body" aria-labelledby="demo-cb-header-1">
        <label class="am-list-item check" v-for="(item,index) in init.tax_type">
          <div class="am-list-content">{{item.text}}</div>
          <div class="am-checkbox">
            <input type="radio" :name="'radio' + BfIndex" :value="item.value" v-model="beneficiary.tax_type">
            <span class="icon-check" aria-hidden="true"></span>
          </div>
        </label>

      </div>
    </div>
    <div class="am-list am-list-6lb form" >
      <div class="app-list-header">反洗钱标准 — 必填</div>
      <div class="am-list-body">
        <!-- 证件为护照时 可以修改国籍 -->
        <div class="am-list-item " v-if="beneficiary.ID_type === 'LAA0029'">
          <div class="am-list-label">国籍</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly v-model="beneficiary.nation_name"
                   @click="toShow('nation')" v-if="beneficiary.nation_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('nation')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <app-input label="国籍" v-else>
          <div slot="input" readonly>中国</div>
        </app-input>
        <!--通讯地址同投保人-->
        <app-input label="是否与投保人同地址？" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':sameAddr}"
                  :disabled="sameAddr"
                  @click="sameAddr = !sameAddr,toblur(),sameAddress(),sameZipcode()">是
          </button>
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':!sameAddr}"
                  :disabled="!sameAddr"
                  @click="sameAddr = !sameAddr,toblur()">否
          </button>
        </app-input>
        <!--通讯地址-->
        <div class="am-list-item" v-if="!sameAddr">
          <div class="am-list-label">通讯地址</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly
                   v-model="beneficiary.province_name + beneficiary.city_name + beneficiary.district_name"
                   @click="toShow('area')" v-if="beneficiary.province_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('area')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <app-input label="详细地址" v-if="!sameAddr">
          <input slot="input" v-model.lazy.trim="beneficiary.address" type="text" placeholder="请输入">
          <div slot="icon" v-show="beneficiary.address !== ''" class="am-list-clear"><i
            class="iconfont icon-chahao" @click="beneficiary.address = ''"></i></div>
        </app-input>
        <app-input label="邮编" v-if="!sameAddr">
          <input slot="input" @change="checkZipcode" maxlength="6" v-model.lazy="beneficiary.zip"
                 type="text" placeholder="请输入" readonly>
          <div slot="icon" v-show="beneficiary.zip !== ''" class="am-list-clear"><i
            class="iconfont icon-chahao" @click="beneficiary.zip = ''"></i></div>
        </app-input>

        <app-input label="手机号码">
          <input slot="input" @change="checkPhone" v-model.number.lazy="beneficiary.phone" type="number" placeholder="请输入(二必选一)">
          <div slot="icon" v-show="beneficiary.phone !== ''" class="am-list-clear"><i class="iconfont icon-chahao" @click="beneficiary.phone = ''"></i></div>
        </app-input>
        <app-input label="固定电话">
          <input slot="input" @change="checkTel" v-model.lazy.trim="beneficiary.calTel" type="text" placeholder="请输入(二必选一)">
          <div slot="icon" v-show="beneficiary.calTel !== ''" class="am-list-clear"><i class="iconfont icon-chahao" @click="beneficiary.calTel = ''"></i></div>
        </app-input>
        <!-- 职业 -->
        <app-input label="职业">
          <div slot="input" @click="$refs.occupation.OccupationShow = true, scrollClose()" placeholder="请点击选择职业" :class="{pd:!beneficiary.job}">
            {{beneficiary.job}}
          </div>
        </app-input>
        <!-- 职业 -->
      </div>
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

export default {
  name: 'Beneficiary',
  props: ['people', 'BfIndex'],
  components: {
    'app-occupation': Occupation,
    vuePickers
  },
  data() {
    return {
      same: false, //同受益人
      longTerm: false, //长期有效
      sameAddr: false, //同地址
      // 受益人信息
      beneficiary: {
        fullname: '', //姓名
        gender: 'LAB0009', //性别
        nation: 'LAI0002', //国籍
        nation_name: '中国', //国籍
        birthday: '', //出生日期
        type: 'LAP0005',//受益类型

        rate: (100 / (this.BfIndex + 1)).toFixed(0), //受益比例
        sort_order: 1, //受益顺序
        // 证件
        ID_type: 'LAA0028', //证件类型
        ID_type_name: '身份证', //证件描述
        ID_no: '', //证件号码
        ID_expire_end: '', //证件有效期
        tax_type: '', //税收类型
        // 通信
        address: '', //通信地址
        province: '', //省
        province_name: '', //省
        city: '', //市
        city_name: '', //市
        district: '', //区
        district_name: '', //区
        zip: '', //通信邮编
        // 职业
        job: '', //职业
        job_code: '', //职业代码

        tel: '', //联系电话
        calTel: '', //固定电话
        phone: '', //手机号码
        beneficiary_is_insured: 0 //关系
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
      return this.$store.state.init
    },
    applicant() {
      return this.$store.state.applicant
    },
    count() {
      return this.$store.state.tmp.people.length //人数
    },
    crt() {
      return this.$store.state.tmp.current //当前受益人
    },
    anti_money() {
      //单次投保达到反洗钱标准（年交保费*交费年期≥20万元）
      // return true
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
      this.beneficiary.ID_expire_end = val ? '9999-12-30' : ''
    },
    same(val) {
      const vm = this
      if (val) {
        let applicant = Api.obj2json(this.applicant)
        vm.beneficiary.genre = applicant.holder_gender
        vm.beneficiary.ID_type = applicant.holder_ID_type
        vm.beneficiary.ID_type_name = applicant.holder_ID_type_name
        vm.beneficiary.tax_type = applicant.holder_isTaxResidents

        vm.beneficiary.ID_no = applicant.holder_ID_no
        vm.beneficiary.ID_expire_end = applicant.holder_ID_expire_end
        if (vm.beneficiary.ID_expire_end === '9999-12-30') vm.longTerm = true
        vm.beneficiary.fullname = applicant.holder_name
        vm.beneficiary.birthday = applicant.holder_birthday

        // 对应关系
        var rels = {
          'LBK0004': 'LAN0015', //配偶
          'LBK0002': 'LAN0016', //父母
          'LBK0003': 'LAN0017', //子女
          'LBK0005': 'LAN0018' //祖孙
        }
        vm.beneficiary.beneficiary_is_insured = rels[applicant.is_assured] || 0
        if (this.anti_money) {
          vm.beneficiary.nation = applicant.holder_home_province
          vm.beneficiary.nation_name = applicant.holder_home_province_name
          vm.beneficiary.province = applicant.holder_contact_province
          vm.beneficiary.province_name = applicant.holder_contact_province_name
          vm.beneficiary.city = applicant.holder_contact_city
          vm.beneficiary.city_name = applicant.holder_contact_city_name
          vm.beneficiary.district = applicant.holder_contact_district
          vm.beneficiary.district_name = applicant.holder_contact_district_name
          vm.beneficiary.address = applicant.holder_contact_address
          vm.beneficiary.zip = applicant.holder_contact_zip
          vm.beneficiary.job = applicant.holder_job_name
          vm.beneficiary.job_code = applicant.holder_job_code
          vm.beneficiary.tel = applicant.holder_mobile ? applicant.holder_mobile : applicant.holder_phone
        }
      } else {
        vm.beneficiary.genre = 'LAB0009'
        vm.beneficiary.ID_type = 'LAA0028'
        vm.beneficiary.ID_type_name = '身份证'
        vm.beneficiary.tax_type = ''
        vm.beneficiary.ID_no = ''
        vm.beneficiary.ID_expire_end = ''
        vm.longTerm = false
        vm.beneficiary.fullname = ''
        vm.beneficiary.birthday = ''
        if (this.anti_money) {
          vm.beneficiary.nation = 'LAI0002'
          vm.beneficiary.nation_name = '中国'
          vm.beneficiary.province = ''
          vm.beneficiary.province_name = ''
          vm.beneficiary.city = ''
          vm.beneficiary.city_name = ''
          vm.beneficiary.district = ''
          vm.beneficiary.district_name = ''
          vm.beneficiary.address = ''
          vm.beneficiary.zip = ''
          vm.beneficiary.job = ''
          vm.beneficiary.job_code = ''
          vm.beneficiary.tel = ''
        }
      }
    }
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
        this.beneficiary.ID_type = val.select1.value
        this.beneficiary.ID_type_name = val.select1.text
        this.pickData.data1 = []
        // this.typeChange()
      } else if (this.resSelect === 'nation') {
        this.beneficiary.nation = val.select1.value
        this.beneficiary.nation_name = val.select1.text
        this.pickData.data1 = []
      } else if (this.resSelect === 'area') {
        this.beneficiary.province = val.select1.value ? val.select1.value : ''
        this.beneficiary.province_name = val.select1.text ? val.select1.text : ''
        this.beneficiary.city = val.select2.value ? val.select2.value : ''
        this.beneficiary.city_name = val.select2.text ? val.select2.text : ''
        this.beneficiary.district = val.select3.value ? val.select3.value : ''
        this.beneficiary.district_name = val.select3.text ? val.select3.text : ''
        this.beneficiary.zip = val.select3.zipCode ? val.select3.zipCode : val.select2.zipCode
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
      } else if (type === 'area') {
        this.columns = 3
        this.link = true
        this.resSelect = 'area'
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
    sameZipcode() {
      this.beneficiary.zipcode = this.applicant.zipcode
    },
    sameAddress() {
      var applicant = Api.obj2json(this.applicant)
      let vm = this
      vm.beneficiary.province = applicant.holder_contact_province
      vm.beneficiary.province_name = applicant.holder_contact_province_name
      vm.beneficiary.city = applicant.holder_contact_city
      vm.beneficiary.city_name = applicant.holder_contact_city_name
      vm.beneficiary.district = applicant.holder_contact_district
      vm.beneficiary.district_name = applicant.holder_contact_district_name
      vm.beneficiary.address = applicant.holder_contact_address
      vm.beneficiary.zip = applicant.holder_contact_zip
    },
    del() {
      this.$store.commit('delBeneficiary', this.people)
      this.$delete(this.$parent.beneficiaries, this.people)
      this.$toast.open('删除成功', 'success')
    },
    // 检查ID是否有效
    IDValidate() {
      const vm = this
      const type = vm.beneficiary.ID_type
      const id = vm.beneficiary.ID_no
      const owner = '受益人'
      var toast_text = null

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
              vm.beneficiary.birthday = idInfo.birth
              vm.beneficiary.gender = sex[idInfo.sex]
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
      vm.beneficiary.ID_no = id.toUpperCase()
      return true
    },
    //姓名校验
    checkName () {
      let toast_text = null
      let strLength = 0
      let name = this.beneficiary.fullname
      const owner = '受益人'
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
    // 校验表单
    checkForm() {
      const vm = this
      var toast_text = null
      let sb = vm.count > 1 ? '第 ' + (vm.BfIndex + 1) + ' 个' : ''
      if (!vm.beneficiary.fullname) {
        toast_text = '请填写' + sb + '受益人【姓名】'
      } else if (!vm.beneficiary.ID_no) {
        toast_text = '请填写' + sb + '受益人【证件号码】'
      } else if (vm.longTerm === false && !vm.checkTerm(sb + '受益人', vm.beneficiary.ID_expire_end)) {
        return false
      } else if (!vm.beneficiary.gender) {
        toast_text = '请选择' + sb + '受益人【性别】'
      } else if (!vm.beneficiary.birthday) {
        toast_text = '请填写' + sb + '受益人【出生日期】'
      } else if (!vm.beneficiary.beneficiary_is_insured) {
        toast_text = '请选择' + sb + '受益人【是被保险人的】'
      } else if (!vm.beneficiary.sort_order) {
        toast_text = '请选择' + sb + '受益人【受益顺序】'
      } else if (!vm.beneficiary.rate) {
        toast_text = '请填写' + sb + '受益人【受益比例】'
      } else if (!vm.beneficiary.tax_type) {
        toast_text = '请选择' + sb + '受益人个人税收居民身份类型'
      } else if (!vm.checkTax(sb + ' 受益人', vm.beneficiary.tax_type)) {
        return false
      } else if (vm.anti_money) {
        if (!vm.beneficiary.nation) {
          toast_text = '请选择' + sb + '受益人【国籍】'
        } else if (!vm.beneficiary.province) {
          toast_text = '请选择' + sb + '受益人【通讯地址省份】'
        } else if (!vm.beneficiary.city) {
          toast_text = '请选择' + sb + '受益人【通讯地址市区】'
        } else if (!vm.beneficiary.address) {
          toast_text = '请填写' + sb + '受益人【详细地址】'
        } else if (!vm.beneficiary.zip && !vm.checkZipcode()) {
          toast_text = '请填写' + sb + '受益人【通信邮编】'
        } else if (vm.beneficiary.phone && !vm.checkPhone()) {
          return false
        } else if (vm.beneficiary.calTel && !vm.checkTel()) {
          return false
        } else if (!vm.beneficiary.tel) {
          toast_text = '请填写' + sb + '受益人【手机号码】或【固定电话】其一'
        } else if (!vm.beneficiary.job_code) {
          toast_text = '请填写' + sb + '受益人【职业】'
        }
      }

      // 重置税收类型
      // if (vm.getAge(vm.beneficiary.birthday) < 16) {
      //   this.beneficiary.tax_type = ''
      // }
      if (toast_text) {
        console.info(toast_text)
        vm.$toast.open(toast_text, 'warn')
        return false
      }
      return vm.IDValidate()
    },
    // 电话校验
    checkTel() {
      if (!/^0\d{10,11}$/.test(this.beneficiary.calTel)) {
        this.$toast.open('电话以0开头,格式为区号+号码,如:01012345678', 'warn')
        return false
      }
      this.beneficiary.tel = this.beneficiary.calTel
      return true
    },
    // 手机校验
    checkPhone() {
      const tel = this.beneficiary.phone
      const owner = '受益人'
      var toast_text = null
      if (!tel) {
        toast_text = owner + '手机号不能为空'
      } else if (this.beneficiary.ID_type === 'LAA0032') {
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
      this.beneficiary.tel = tel
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
    // 清除通讯地址
    clearAddress() {
      this.beneficiary.province = ''
      this.beneficiary.city = ''
      this.beneficiary.district = ''
      this.beneficiary.address_select = ''
      this.$refs.address.clear()
    },
    // 设置职业
    // 设置职业
    setOccupation(selected) {
      this.beneficiary.job_code = {
        '1': selected.value[0],
        '2': selected.value[1],
        '3': selected.value[2],
        '4': selected.value[3]
      }
      this.beneficiary.job = selected.text
    },
    // 清除职业
    clearOccupation() {
      this.beneficiary.job_code = ''
      this.beneficiary.job = ''
      this.$refs.occupation.show = true
    }
  }
}
</script>
