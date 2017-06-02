<template>
  <div id="Confirmation">
    <div id="preview">
      <img v-if="list" class="app-img preview-img" v-for="(item, index) in list" :src="item.src" @click="$preview.open(index, list)">
    </div>
    <div class="am-tab am-fixed am-fixed-bottom app-navi">
      <router-link to="/" class="am-tab-item selected">返回</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Confirmation',
  data() {
    const baseUrl = '//cloud.ehuimeng.com/Theme/index/home/XT_ins/images/'
    return {
      list: [{
        src: baseUrl + '334886745985965796.jpg',
        w: 1240,
        h: 1754
      }, {
        src: baseUrl + '50231538445562057.jpg',
        w: 1240,
        h: 1754
      }],
      photoswipe: null
    }
  }
}
</script>
