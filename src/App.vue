<template>
  <div id="app" class="app-container">
    <keep-alive>
      <router-view>
        <div class="am-loading page">
          <i class="am-icon loading" aria-hidden="true"></i>
          <div class="am-loading-text">加载中</div>
        </div>
      </router-view>
    </keep-alive>
  </div>
</template>
<script>
import Api from './api'
export default {
  name: 'app',
  data() {
    return {
      frame: ''
    }
  },
  created() {
    this.$toast.open('初始化数据', 'loading')
    Api.initField(res => {
      this.$toast.close()
      this.$store.dispatch('saveInit', res)
    })
  }
}
</script>
