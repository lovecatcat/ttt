<template>
  <section id="billinfo">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">
        首/续期收费账户信息
      </div>
      <div class="am-list-body">
        <app-input label="首期缴费方式" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':bank.PayMode===item.value}"
                  v-for="(item,index) in init.PayMode"
                  @click="bank.PayMode = item.value, toblur()">{{item.text}}
          </button>
        </app-input>
        <app-input label="续期缴费方式" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':bank.ExPayMode===item.value}"
                  v-for="(item,index) in init.ExPayMode"
                  @click="bank.ExPayMode = item.value, toblur()">{{item.text}}
          </button>
        </app-input>
        <app-input label="户名">
          <input slot="input" disabled v-model.trim="applicant.holder_name" type="text" placeholder="请输入">
        </app-input>
        <app-input label="账户类型" class="am-list-control-button">
          <button slot="button" class="am-button tiny"
                  :class="{'tiny-blue':bank.bank_type===item.value}"
                  v-for="(item,index) in init.bank_type"
                  @click="bank.bank_type = item.value, toblur()">{{item.text}}
          </button>
        </app-input>
        <app-input label="银行账号">
          <input slot="input" v-model="bank.bank_no" type="text" placeholder="请输入" @change="checkAccount">
          <div slot="icon" v-show="bank.bank_no != ''" class="am-list-clear"><i class="iconfont icon-chahao" @click="bank.bank_no = ''"></i></div>
        </app-input>
        <div class="am-list-item ">
          <div class="am-list-label">开户行</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly v-model="bank.temp_bank_name"
                   @click="toShow('bankname')" v-if="bank.temp_bank_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('bankname')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
        <div class="am-list-item ">
          <div class="am-list-label">开户地址</div>
          <div class="am-list-control">
            <input type="text" placeholder="请选择" readonly
                   v-model="bank.bank_area_name"
                   @click="toShow('area')" v-if="bank.bank_area_name">
            <input type="text" placeholder="请选择" readonly @click="toShow('area')" v-else>
            <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list am-list-6lb form am-list-last">
      <div class="app-list-brief">
        本人以真实姓名开立结算账户（银行卡/存折/贷记卡），且账户所有人为投保人本人。本人不可撤销地授权贵公司和经办银行（或第三方支付公司）从上述账户中扣划本投保申请所需交付的各期保险费用及接收贵公司的各种退费。扣款数据以贵公司向经办银行（或第三方支付公司）提供的电子数据或单证为准，扣款时间为贵公司收到投保申请之日起三个工作日内。本授权条款为本人对贵公司和经办银行（或第三方支付公司）从其账户中扣划本投保申请所需交付各期保险费用及接收贵公司各种退费的授权证明。
      </div>
      <div class="app-agreement">
        <div class="am-checkbox mini argument">
          <input id="agree2" type="checkbox" v-model="agreement">
          <span class="icon-check"></span>
          <label class="am-ft-md " for="agree2">我已阅读 <a>转账授权声明</a></label>
        </div>
      </div>
    </div>
    <div class="am-button-group am-fixed am-fixed-bottom" role="group" aria-label="操作按钮组" v-show="group">
      <button type="button" class="am-button blue">确认支付</button>
    </div>
    <!-- 开户行所在地 -->
    <!--vue-pickers-->
    <vue-pickers :show="show" :link="link" :columns="columns" :selectData="pickData" @cancel="close"
                 @confirm="confirmFn"></vue-pickers>
  </section>
</template>
<script>
  import Api from '../api'
  // 区域选择器
  import vuePickers from 'vue-pickers'
  import {provs_data, citys_data} from 'vue-pickers/lib/areaData'

  export default {
    name: 'billinfo',
    components: {
      vuePickers
    },
    data() {
      return {
        agreement: false, //协议
        war_id: '',
        bank: {
          PayMode: 'LAT0008', //首期缴费方式
          ExPayMode: 'LBJ0002',//续期缴费方式
          bank_holder: '', //户名
          bank_name: '', //开户行
          temp_bank_name: '请选择', //开户行名称
          bank_type: '',//账户类型
          bank_no: '',//卡号
          bank_province: '', // 省
          bank_province_name: '', // 省
          bank_area: '', //市
          bank_area_name: '' //市
        },
        isCopy: '',
        res: null,
        show: false,
        columns: 1,
        link: true,
        pickData: {
          data1: provs_data,
          data2: citys_data
        },
        resSelect: null,
        group: true, //底部按钮
        docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
        showHeight: document.documentElement.clientHeight   //实时屏幕高度
      }
    },
    computed: {
      applicant() {
        return this.$store.state.applicant //户名
      },
      init() {
        return this.$store.state.init || {}
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path === '/healthinfo') {
        next()
        return false
      }
      this.$store.commit('saveBank', this.bank)
      this.checkForm() && next()
    },
    created() {
      // let vm = this
      this.war_id = this.$route.query.id || '7688'
      Api.editWarranty(this.war_id, res => {
        console.log(res)
      })
    },
    mounted() {
      // window.onresize监听页面高度的变化
      window.onresize = () => {
        return (() => {
          this.showHeight = document.body.clientHeight
        })()
      }
    },
    watch: {
      showHeight() {
        if (this.docmHeight > this.showHeight) {
          this.group = false
        } else {
          this.group = true
        }
      }
    },
    methods: {
      close() {
        this.show = false
      },
      confirmFn(val) {
        console.log(val)
        this.show = false
        // this.res = val
        // this.defaultData = [val.select1]
        if (this.resSelect === 'bankname') {
          this.bank.bank_name = val.select1.value
          this.bank.temp_bank_name = val.select1.text
          this.pickData.data1 = []
        } else if (this.resSelect === 'area') {
          this.bank.bank_province = val.select1.value ? val.select1.value : ''
          this.bank.bank_province_name = val.select1.text ? val.select1.text : ''
          this.bank.bank_area = val.select2.value ? val.select2.value : ''
          this.bank.bank_area_name = val.select2.text ? val.select2.text : ''
          this.bank.bank_area_name = this.bank.bank_province_name + this.bank.bank_area_name
        }
      },
      toShow(type) {
        document.activeElement.blur()
        this.columns = 1
        this.link = false
        if (type === 'bankname') {
          this.resSelect = 'bankname'
          this.pickData.data1 = this.init.bank_code
        } else if (type === 'area') {
          this.columns = 2
          this.link = true
          this.resSelect = 'area'
          this.pickData.data1 = provs_data
          this.pickData.data2 = citys_data
        }
        this.show = true
      },
      //失去焦点
      toblur() {
        document.activeElement.blur()
      },
      checkForm() {
        let toast_text = ''
        if (!this.bank.PayMode) {
          toast_text = '请选择首期缴费方式'
        } else if (!this.bank.ExPayMode) {
          toast_text = '请选择续期缴费方式'
        } else if (!this.applicant.holder_name) {
          toast_text = '户名不能为空'
        } else if (!this.bank.bank_type) {
          toast_text = '请选择账户类型'
        } else if (!this.bank.bank_name) {
          toast_text = '请选择开户行'
        } else if (!this.checkAccount()) {
          return false
        } else if (!this.bank.bank_province) {
          toast_text = '银行所在省份不能为空'
        } else if (!this.bank.bank_area) {
          toast_text = '银行所在城市不能为空'
        } else if (this.agreement === false) {
          toast_text = '请先确认阅读《转账授权声明》'
        }
        if (toast_text) {
          this.$toast.open(toast_text, 'warn')
          return false
        }
        return true
      },
      checkAccount() {
        let vm = this
        let number = vm.bank.bank_no
        let toast_text = null
        if (!number) {
          toast_text = '银行账号不能为空'
        } else if (isNaN(number)) {
          toast_text = '银行卡号必须是数字'
        } else if (number.length > 20) {
          toast_text = '银行卡号最长为20位'
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

