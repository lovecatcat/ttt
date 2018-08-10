<template>
  <div id="Success">
    <div class="am-message result">
      <i class="am-icon result success"></i>
      <div class="am-message-main" v-if="insured.code == '1'">自核通过，支付成功</div>
      <div class="am-message-main" v-else-if="insured.code == '-1'">进入人工核保</div>
      <!--重新支付-->
      <div class="am-message-main" v-if="insured.state == '0'">自核支付成功</div>
      <div class="am-message-main" v-else-if="insured.state == '5'">人核支付成功</div>
      <div class="am-message-sub am-ft-left">
        <br>
        <template v-if="insured.data && insured.data.policy_no">
          <p>保单号 : {{insured.data.policy_no}}</p>
          <!--<P v-else-if="insured.code == '-1'">请去个人中心 - 寿险订单查看该单信息</P>-->
          <P>请去个人中心 - 寿险订单查看该单信息</P>
          <P v-if="insured.code == '1'">请线下提交相关影像资料</P>
          <P v-else-if="insured.code == '-1'">请等待人工核保通过</P>
        </template>
        <!--重新支付-->
        <template v-if="insured.state">
          <P>请去个人中心 - 寿险订单查看该单信息</P>
          <P v-if="insured.code == '1'">请线下提交相关影像资料</P>
          <P v-else-if="insured.code == '-1'">请等待人工核保通过</P>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex'

  export default {
    name: 'success',
    computed: {
      ...mapState([
        'insured',
        'uploadImg'
      ])
    }
  }
</script>
