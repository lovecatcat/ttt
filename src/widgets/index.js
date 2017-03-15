import Vue from 'vue'

import Input from './Input'
import Select from './Select'
import Dropdown from './Dropdown'

const AppDialog = {
  template: `
  <div class="am-dialog show app-dialog">
    <div class="am-dialog-wrap">
      <slot name="header"></slot>
      <slot name="body"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
  `
}
Vue.component('app-dialog', AppDialog)
Vue.component('app-input', Input)
Vue.component('app-select', Select)
Vue.component('app-dropdown', Dropdown)
  // Vue.component('app-accupation', Occupation)

///////////
// 日期格式化 //
///////////
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  }
  return fmt;
};

