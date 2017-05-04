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
    var vm = this
    vm.$toast.open('初始化数据', 'loading')
    Api.initField(res => {
      vm.$toast.close()
      vm.$store.dispatch('saveInit', res)
    })
    $_GET['admin_id'] && Api.queryPersonInfo($_GET['admin_id'], response => {
      if (response.name && response.name.indexOf('Error') > -1) {
        vm.$toast.open('服务器开小差了', 'error')
        return
      }
      if (response.data.status === 1) {
        vm.IDNumber = response.data.message.code
      } else {
        vm.$toast.open('不存在该业务员，请重新获取链接', '', 2000, () => {
          location.href = '/Wechat/XT_ins'
        })
      }
    })
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
  .app-container{
    margin-top: .3rem;
  }
</style>
