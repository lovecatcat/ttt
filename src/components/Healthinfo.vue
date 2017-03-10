<template>
  <div id="Healthinfo">
    <div class="app-list-header am-flexbox">
      <div class="am-flexbox-item"><span class="app-iconfont">&#xe631;</span>健康告知</div>
    </div>
    <div class="am-list am-list-6lb form" v-for="item,index in matters">
      <div class="am-list-item">
        <div class="app-list-title">{{item.entry}}. {{item.content}}</div>
      </div>
      <div v-if="item.child">
        <div class="am-list-body" v-for="childitem in item.child">
          <div class="am-list-item">
            <div class="app-list-title">{{childitem.entry}}. {{childitem.content}}</div>
          </div>
          <div class="app-list" :class="{'flex-right':!isExempted}">
            <div class="app-list-title" v-if="isExempted">被保险人</div>
            <div class="am-switch">
              <input type="checkbox" v-model="clientvalue.ass_amswer[item.entry+childitem.entry]" @change="assChanged(clientvalue.ass_amswer,childitem.entry)" :value="item.entry+childitem.entry" class="am-switch-checkbox" :id="'assmatter'+childitem.entry">
              <label class="am-switch-label" :for="'assmatter'+childitem.entry">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
          <div class="app-list" v-if="isExempted">
            <div class="app-list-title">投保人</div>
            <div class="am-switch">
              <input type="checkbox" v-model="clientvalue.app_amswer[item.entry+childitem.entry]" @change="appChanged(clientvalue.app_amswer,childitem.entry)" :value="item.entry+childitem.entry" class="am-switch-checkbox" :id="'appmatter'+childitem.entry">
              <label class="am-switch-label" :for="'appmatter'+childitem.entry">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="am-list-body" v-else>
        <div class="app-list" :class="{'flex-right':!isExempted}">
          <div class="app-list-title" v-if="isExempted">被保险人</div>
          <div class="am-switch">
            <input type="checkbox" v-model="clientvalue.ass_amswer[item.entry]" @change="assChanged(clientvalue.ass_amswer,item.entry)" :value="item.entry" class="am-switch-checkbox" :id="'assmatter'+item.entry">
            <label class="am-switch-label" :for="'assmatter'+item.entry">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
        <div class="app-list" v-if="isExempted">
          <div class="app-list-title">投保人</div>
          <div class="am-switch">
            <input type="checkbox" v-model="clientvalue.app_amswer[item.entry]" @change="appChanged(clientvalue.app_amswer,item.entry)" :value="item.entry" class="am-switch-checkbox" :id="'appmatter'+item.entry">
            <label class="am-switch-label" :for="'appmatter'+item.entry">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
      <div v-if="item.answer" class="app-list">
        <div class="app-list-control">
          <div class="app-list-brief">被保险人{{item.answer}}</div>
          <textarea v-model.lazy="clientvalue.fields[item.entry]"></textarea>
        </div>
      </div>
      <div v-if="item.answer && isExempted" class="app-list">
        <div class="app-list-control">
          <div class="app-list-brief">投保人{{item.answer}}</div>
          <textarea v-model.lazy="clientvalue.app_fields[item.entry]"></textarea>
        </div>
      </div>
    </div>
    <div class="am-tab am-fixed am-fixed-bottom app-navi">
      <router-link to="/beneficiaries" class="am-tab-item">上一步</router-link>
      <router-link to="/billinfo" class="am-tab-item selected">下一步</router-link>
    </div>
  </div>
</template>
<script>
import Api from '../api'
const filters = function(matters, ver, age = 20) {
  return matters.filter(matter => {
    const bool = matter.version == ver
    if (matter.entry == 9 && bool) {
      return age < 18
    }
    return bool
  })
}
export default {
  name: 'Healthinfo',
  data() {
    return {
      matters: [], //健康告知问题
      clientvalue: {
        app_amswer: {}, //投保人勾选
        app_fields: {}, //投保人填写字段
        ass_amswer: {}, //被保险人勾选
        fields: {} //被保人用户字段
      },
      isExempted: false // 是否豁免投保人
    }
  },
  created() {
    const vm = this
    var assured = vm.$store.state.assured
    const age = assured.birthday ? (new Date().getFullYear() - assured.birthday.substr(0, 4)) : 20
    const verison = 2
    Api.queryMatters(res => {
      vm.matters = filters(res, verison, age)
      vm.$store.dispatch('saveMatters', vm.matters)
    })
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == '/beneficiaries') {
      next()
      return false
    }
    this.$store.commit('saveClientValue', this.clientvalue)
    next()
  },
  methods: {
    appChanged(val, id) {
      console.log(val, id)
    },
    assChanged(val, id) {
      console.log(val, id)
    },
    checkForm() {}
  }
}
</script>
