<template>
  <div id="app" class="app-container">
    <keep-alive>
      <router-view></router-view>
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
