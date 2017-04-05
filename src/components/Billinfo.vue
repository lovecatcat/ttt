<template>
  <div id="billinfo">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header am-flexbox">
        <div class="am-flexbox-item"><span class="app-iconfont">&#xe631;</span>首/续期收费账户信息</div>
      </div>
      <div class="am-list-body">
        <app-input label="首期、续期交费方式">
          <input slot="input" disabled value="银行转账">
        </app-input>
        <app-input label="户名">
          <input slot="input" disabled v-model.trim="warranty.applicant" type="text" placeholder="请填写户名">
        </app-input>
        <app-input label="银行账号">
          <input slot="input" v-model="warranty.bank_account" type="text" placeholder="请填写银行账号" @change="checkAccount">
          <div slot="icon" v-show="warranty.bank_account != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="warranty.bank_account = ''"></i></div>
        </app-input>
        <app-select label="开户行">
          <select v-model="warranty.bank_name" v-if="init.transferstate">
            <option disabled value="0">请选择开户行</option>
            <option v-for="item in init.transferstate.bank_name" :value="item.bs_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-select label="账户类别">
          <select v-model="warranty.bank_card" v-if="init.transferstate">
            <option disabled value="0">请选择账户类别</option>
            <option v-for="item in init.transferstate.bank_card" :value="item.bs_id">{{item.explain}}</option>
          </select>
        </app-select>
        <app-input label="开户行所在地">
          <input slot="input" v-model.trim="warranty.bank_address" type="text" placeholder="请点击进行选择" @click="$refs.address.show=true">
          <div slot="icon" v-show="warranty.bank_address != ''" class="am-list-clear"><i class="am-icon-clear am-icon" @click="clearAddress"></i></div>
        </app-input>
      </div>
    </div>
    <div class="app-agreement">
      <div class="am-content">
        <div class="am-checkbox mini argument">
          <input id="agree2" type="checkbox" v-model="agreement">
          <span class="icon-check"></span>
          <label class="am-ft-md" for="agree2">我已阅读 <a>转账授权声明</a></label>
        </div>
      </div>
    </div>
    <div class="app-article">
      本人以真实姓名开立结算账户（银行卡/存折/贷记卡），且账户所有人为投保人本人。本人不可撤销地授权贵公司和经办银行（或第三方支付公司）从上述账户中扣划本投保申请所需交付的各期保险费用及接收贵公司的各种退费。扣款数据以贵公司向经办银行（或第三方支付公司）提供的电子数据或单证为准，扣款时间为贵公司收到投保申请之日起三个工作日内。本授权条款为本人对贵公司和经办银行（或第三方支付公司）从其账户中扣划本投保申请所需交付各期保险费用及接收贵公司各种退费的授权证明。
    </div>
    <div class="am-tab am-fixed am-fixed-bottom app-navi">
      <router-link to="/healthinfo" class="am-tab-item">上一步</router-link>
      <router-link to="/preview" class="am-tab-item selected">下一步</router-link>
    </div>
    <!-- 开户行所在地 -->
    <app-region v-if="init.applicant" ref="address" :level="2" v-on:regionselect="address_selected"></app-region>
  </div>
</template>
<script>
// var BIN = require('bankcardinfo');

// 区域选择器
import Region from './Region'

export default {
  name: 'billinfo',
  components: {
    'app-region': Region
  },
  data() {
    return {
      agreement: false, //协议
      warranty: {
        applicant: this.$store.state.applicant.name, //户名
        bank_card: '45', //卡折标志
        bank_name: 0, //银行名称
        bank_account: '', //银行帐号
        bank_province: '', //银行省编码
        bank_city: '', //银行市编码
        bank_address: '', // 银行地址
        first_way: '53', //
        renewal_way: '55' //首期/续期交费方式
      }
    }
  },
  computed: {
    init() {
      return this.$store.state.init || {}
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == '/healthinfo') {
      next()
      return false
    }
    this.$store.commit('setWarranty', this.warranty)
    this.checkForm() && next()
  },
  methods: {
    checkForm() {
      var toast_text = ''
      if (!this.warranty.applicant) {
        toast_text = '户名不能为空'
      } else if (!this.warranty.bank_name) {
        toast_text = '银行名称不能为空'
      } else if (!this.checkAccount()) {
        return false
      } else if (!this.warranty.bank_province) {
        toast_text = '银行所在省份不能为空'
      } else if (!this.warranty.bank_city && this.warranty.bank_province != 3877) {
        toast_text = '银行所在城市不能为空'
      } else if (this.agreement == false) {
        toast_text = '请先确认阅读《转账授权声明》'
      }
      if (toast_text) {
        this.$toast.open(toast_text, 'warn')
        return false
      }
      return true
    },
    clearAddress() {
      this.warranty.bank_province = ''
      this.warranty.bank_city = ''
      this.warranty.bank_district = ''
      this.warranty.bank_address = ''
      this.$refs.address.show = true
    },
    // 通讯地址选择
    address_selected(selected) {
      var vm = this
      var select_show = selected[0].explain
      vm.$set(vm.warranty, 'bank_province', selected[0].if_id)
      if (selected[1]) {
        select_show += selected[1].explain
        vm.$set(vm.warranty, 'bank_city', selected[1].if_id)
      }
      if (selected[2]) {
        select_show += selected[2].explain
        vm.$set(vm.warranty, 'bank_district', selected[2].if_id)
      }
      vm.$set(vm.warranty, 'bank_address', select_show)
    },
    checkAccount() {
      var vm = this
      var number = vm.warranty.bank_account
      var toast_text = null
      if (!number) {
        toast_text = '银行账号不能为空'
      } else if (isNaN(number)) {
        toast_text = '银行卡号必须是数字'
      }
      if (toast_text) {
        vm.$toast.open(toast_text, 'warn')
        return false
      }
      return true
    }
  }
}
</script>
