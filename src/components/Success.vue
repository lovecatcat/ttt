<template>
  <div id="Success">
    <div class="am-message result" v-if="state">
      <i class="am-icon result success"></i>
      <div class="am-message-main">{{title}}</div>
      <div class="am-message-sub">
        <p v-if="state == 1">自核通过，则在线进行收费；</p>
        <p v-else>自核不通过进入人工核保，则进行自动转为线下扣款</p>
        <a class="am-page-result-button" href="./">返回首页</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Success',
  data() {
    return {
      state: this.$store.state.result
    }
  },
  computed: {
    title() {
      return this.state == 1 ? '投保成功' : '进入人工核保'
    }
  }
}
</script>
