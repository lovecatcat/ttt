<template>
  <div id="app" class="app-container">
    <router-view v-if="$route.meta.keepnew">
    </router-view>
    <keep-alive>
      <router-view v-if="!$route.meta.keepnew">
        <div class="am-loading page">
          <i class="am-icon loading" aria-hidden="true"></i>
          <div class="am-loading-text">加载中</div>
        </div>
      </router-view>
    </keep-alive>
    <!-- <app-alert ref="alert"></app-alert> -->
  </div>
</template>
<script>
import Api from './api'
// import Alert from '@/components/Alert'
export default {
  name: 'app',
  data() {
    return {
      frame: ''
    }
  },
/*  components: {
    'app-alert': Alert
  },*/
  created() {
    this.$toast.open('初始化数据', 'loading')
    Api.initField(res => {
      this.$toast.close()
      this.$store.dispatch('saveInit', res)
    })
  }
}
</script>
