<template>
  <div id="app" class="app-container">
    <div class="float" v-if="IDNumber">
      ID: {{IDNumber}}
    </div>
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
  </div>
</template>
<script>
import Api from './api'
import $_GET from './widgets/Get'

export default {
  name: 'app',
  data() {
    return {
      IDNumber: ''
    }
  },
  created() {
    let vm = this
    vm.$toast.open('初始化数据', 'loading')
    // Api.login(res => {
    //   console.log('login')
    // })
    Api.initField(res => {
      vm.$toast.close()
      vm.$store.dispatch('saveInit', res)
    })
    let user_id = $_GET['user_id']
    if (user_id) {
      vm.$store.commit('setUserId', user_id)
    } else {
      this.$router.push('/NotFound')
    }
  }
}
</script>
<style>
  .float{
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    width: 98%;
    text-align: right;
    padding-right: 2%;
    background-color: rgba(0,0,0,.4);
    color: #fff;
    height: .3rem;
    line-height: .3rem;
    /*font-size: .14rem;*/
  }
</style>
