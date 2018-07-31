<template>
  <div id="Success">
    <div class="am-message result">
      <i class="am-icon result success"></i>
      <div class="am-message-main">{{insured.code == 1 ? '投保成功' : '进入人工核保'}}</div>
      <div class="am-message-sub am-ft-left">
        <br>
        <template v-if="insured.code == 1">
          <p>自核通过，稍后在线进行收费</p>
        </template>
        <p v-else>自核不通过进入人工核保，并自动转为线下扣款</p>
        <br>
        <p v-if="insured.data.policy_no">投保单号：{{insured.data.policy_no}}</p>
        <!--<p v-if="uploadImg && uploadImg.status != '1'">{{uploadImg.message}}</p>-->
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
