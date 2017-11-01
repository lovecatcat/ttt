<template>
  <div id="Success">
    <div class="am-message result">
      <i class="am-icon result success"></i>
      <div class="am-message-main">{{status === 1 ? '投保成功' : '进入人工核保'}}</div>
      <div class="am-message-sub am-ft-left">
        <br>
        <template v-if="status == 1">
          <p>自核通过，稍后在线进行收费</p>
        </template>
        <p v-else>自核不通过进入人工核保，并自动转为线下扣款</p>
        <br>
        <p v-show="tid">投保单号：{{tid}}</p>
        <br>
        <p class="am-ft-right"><a class="am-page-result-button" href="https://ehuimeng.kuaizhan.com">返回首页</a> &nbsp;&nbsp;<a class="am-page-result-button app-color-warn" href="/wechat/PER_index">个人中心</a></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'success',
  computed: {
    status() {
      return +this.$store.state.status
    },
    tid() {
      return this.$store.state.tid
    }
  }
}
</script>
