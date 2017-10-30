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
import qs from 'qs'

var share = function (share) {
  /* eslint-disable */
  wx.ready(function () {
    wx.onMenuShareTimeline(share)
    wx.onMenuShareAppMessage(share)
    wx.onMenuShareQQ(share)
    wx.onMenuShareWeibo(share)
    wx.onMenuShareQZone(share)
  })
  /* eslint-enable */
}

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
    Api.share(qs.stringify({
      url: location.href
    }), res => {
      vm.initShare(res.data)
    })
  },
  methods: {
    initShare(d) {
      // eslint-disable-next-line
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: d.appId, // 必填，公众号的唯一标识
        timestamp: d.timestamp, // 必填，生成签名的时间戳
        nonceStr: d.noncestr, // 必填，生成签名的随机串
        signature: d.signature, // 必填，签名，见附录1
        jsApiList: [ // 授权接口列表
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone'
        ]
      })
      var params = {
        admin_id: $_GET['admin_id'],
        shared: true
      }
      share({
        title: '信泰人寿在线投保',
        desc: '\r\n【汇盟保险，更专业的保险管家】',
        link: 'http://cloud.ehuimeng.com/Wechat/XT_ins2c?' + qs.stringify(params), // 分享链接
        imgUrl: location.protocol + '//' + location.host + '/Theme/index/home/images/logo.png' // 分享图标
      })
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
  .app-container{
    margin-top: .3rem;
  }
</style>
