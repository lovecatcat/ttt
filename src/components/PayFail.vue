<template>
  <div id="Success">
    <div class="am-message result">
      <i class="am-icon result success"></i>
      <div class="am-message-main">核保成功，支付失败</div>
      <div class="am-message-sub am-ft-left">
        <br>
        <p>请去个人中心-寿险订单查看该单信息</p>
        <br>
        <p v-if="insured.data.policy_no">投保单号：{{insured.data.policy_no}}</p>
        <br>
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
