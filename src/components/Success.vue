<template>
  <div id="Success">
    <div class="am-message result" v-if="state">
      <i class="am-icon result success"></i>
      <div class="am-message-main">{{title}}</div>
      <div class="am-message-sub">
        <template v-if="state == 1">
          <p>自核通过，稍后在线进行收费</p>
          <p v-show="tid">投保单号为：{{tid}}</p>
        </template>
        <p v-else>自核不通过进入人工核保，并进行自动转为线下扣款</p>
        <br>
        <a class="am-page-result-button" href="//m.ehuimeng.com">返回首页</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Success',
  computed: {
    state() {
      return this.$store.state.result
    },
    tid() {
      return this.$store.state.tid
    },
    title() {
      return this.state == 1 ? '投保成功' : '进入人工核保'
    }
  }
}
</script>
