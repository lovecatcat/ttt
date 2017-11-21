<template>
  <div id="Success">
    <div class="am-message result">
      <i class="am-icon result success"></i>
      <div class="am-message-main">{{insured.status == 1 ? '投保成功' : '进入人工核保'}}</div>
      <div class="am-message-sub am-ft-left">
        <br>
        <template v-if="insured.status == 1">
          <p>自核通过，稍后在线进行收费</p>
        </template>
        <p v-else>自核不通过进入人工核保，并自动转为线下扣款</p>
        <br>
        <p v-if="insured.ProposalContNo">投保单号：{{insured.ProposalContNo}}</p>
        <p v-if="uploadImg && uploadImg.status != '1'">{{uploadImg.message}}</p>
        <br>
        <p class="am-ft-right">
          <a class="am-page-result-button" href="https://ehuimeng.kuaizhan.com">返回首页</a> &nbsp;&nbsp;<a
          class="am-page-result-button app-color-warn" href="/wechat/PER_index">个人中心</a>
        </p>
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
