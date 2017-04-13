<template>
  <div id="Healthinfo">
    <div class="app-list-header am-flexbox">
      <div class="am-flexbox-item"><span class="app-iconfont">&#xe631;</span>健康告知</div>
    </div>
    <div v-show="showPup0ver" class="app-mask"></div>
    <div class="am-list am-list-6lb form" v-for="item,index in matters">
      <div class="am-list-item">
        <div class="app-list-title">{{item.entry}}. {{item.content}}</div>
      </div>
      <div v-if="item.child">
        <div class="am-list-body" v-for="childitem in item.child">
          <div class="am-list-item">
            <div class="app-list-title">{{childitem.entry}}. {{childitem.content}}</div>
          </div>
        </div>
      </div>
      <div class="am-list-body">
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
        <div class="am-list-item" v-if="clientvalue.fields[item.entry]">
          <div class="am-ft-md am-ft-red" v-html="clientvalue.fields[item.entry]"></div>
        </div>
      </div>
      <app-form :ref="'form'+item.entry" :k="item.entry" v-if="forms[item.entry]" :forms="forms[item.entry]" :index="item.entry">
        <button slot="cancel" type="button" class="am-button tiny" @click="showPup0ver = false">取消</button>
      </app-form>
    </div>
    <div class="app-agreement">
      <div class="am-checkbox mini argument">
        <input id="agree2" type="checkbox" v-model="allNo">
        <span class="icon-check"></span>
        <label class="am-ft-md" for="agree2">【被保人】告知事项全是否</label>
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
export default {
  name: 'Healthinfo',
  components: {
    'app-form': {
      template: `
      <div class="app-pupover" v-show="show">
        <div class="am-list form">
          <template v-for="item in forms">
            <div class="am-list-item" v-if="item.type=='radio'">
              <div class="am-list-content">{{item.title}}</div>
              <div class="am-switch">
                <input type="checkbox" v-model="item.input" class="am-switch-checkbox" :id="'item'+index">
                <label class="am-switch-label" :for="'item'+index">
                  <div class="am-switch-inner"></div>
                  <div class="am-switch-switch"></div>
                </label>
              </div>
            </div>
            <app-input :label="item.title" v-else-if="item.type=='date'">
              <input slot="input" :class="{'has':item.input != ''}" v-model="item.input" type="month" placeholder="请选择时间">
              <div slot="icon" class="am-list-clear" @click="item.input = ''"><i class="am-icon-clear am-icon"></i></div>
            </app-input>
            <app-input :label="item.title" v-else-if="item.type=='text'">
              <input slot="input" v-model="item.input" type="text" placeholder="必填">
              <div slot="icon" class="am-list-clear" @click="item.input = ''"><i class="am-icon-clear am-icon"></i></div>
            </app-input>
          </template>
          <div class="am-button-group">
            <button type="button" class="am-button tiny" @click="cancel">取消</button>
            <button type="button" class="am-button tiny" @click="comfirm">确定</button>
          </div>
        </div>
      </div>
      `,
      props: ['forms', 'index'],
      data() {
        return {
          show: false
        }
      },
      methods: {
        cancel() {
          this.show = false
          this.$parent.showPup0ver = false
          this.$parent.clientvalue.ass_amswer[this.index] = false
          this.$parent.clientvalue.fields[this.index] = ''
        },
        comfirm() {
          if (!this.checkForm()) {
            return false
          }
          this.show = false
          this.$parent.showPup0ver = false
        },
        checkForm() {
          var bool = true
          var field = ''
          for (var i in this.forms) {
            var j = this.forms[i]
            if (!j.input && j.type !== 'radio') {
              this.$toast.open('请填写' + j.title, '')
              bool = false
              return false
            }
            let text
            if (j.type === 'radio') {
              text = j.input === true ? '是' : '否'
            } else {
              text = j.input
            }
            field += j.title + '：' + text + '\t'
          }
          // 合并输入内容
          this.$set(this.$parent.clientvalue.fields, this.index, field)
          return bool
        }
      }
    }
  },
  data() {
    return {
      forms: {
        '3': [{
          title: '检查原因',
          input: '',
          type: 'text'
        }, {
          title: '检查时间',
          input: '',
          type: 'date'
        }, {
          title: '检查地点',
          input: '',
          type: 'text'
        }, {
          title: '检查结果',
          input: '',
          type: 'text'
        }],
        '4': [{
          title: '住院时间',
          input: '',
          type: 'date'
        }, {
          title: '原因',
          input: '',
          type: 'text'
        }, {
          title: '医院名称',
          input: '',
          type: 'text'
        }, {
          title: '目前状况',
          input: '',
          type: 'text'
        }],
        '5': [{
          title: '是否住院',
          input: '',
          type: 'radio'
        }, {
          title: '发病时间',
          input: '',
          type: 'date'
        }, {
          title: '疾病名称',
          input: '',
          type: 'text'
        }, {
          title: '诊疗医院',
          input: '',
          type: 'text'
        }, {
          title: '目前状况',
          input: '',
          type: 'text'
        }],
        '6': [{
          title: '智障等级',
          input: '',
          type: 'text'
        }, {
          title: '残疾部位',
          input: '',
          type: 'text'
        }, {
          title: '原因',
          input: '',
          type: 'text'
        }, {
          title: '程度',
          input: '',
          type: 'text'
        }],
        '7': [{
          title: '药物名称',
          input: '',
          type: 'text'
        }, {
          title: '使用时间',
          input: '',
          type: 'date'
        }, {
          title: '目前状况',
          input: '',
          type: 'text'
        }],
        '8': [{
          title: '是否住院',
          input: '',
          type: 'radio'
        }, {
          title: '发病时间',
          input: '',
          type: 'date'
        }, {
          title: '疾病名称',
          input: '',
          type: 'text'
        }, {
          title: '诊疗医院',
          input: '',
          type: 'text'
        }, {
          title: '目前状况',
          input: '',
          type: 'text'
        }],
        '9': [{
          title: '是否住院',
          input: '',
          type: 'radio'
        }, {
          title: '发病时间',
          input: '',
          type: 'date'
        }, {
          title: '疾病名称',
          input: '',
          type: 'text'
        }, {
          title: '诊疗医院',
          input: '',
          type: 'text'
        }, {
          title: '目前状况',
          input: '',
          type: 'text'
        }],
        '10': [{
          title: '是否住院',
          input: '',
          type: 'radio'
        }, {
          title: '发病时间',
          input: '',
          type: 'date'
        }, {
          title: '疾病名称',
          input: '',
          type: 'text'
        }, {
          title: '诊疗医院',
          input: '',
          type: 'text'
        }, {
          title: '目前状况',
          input: '',
          type: 'text'
        }],
        '16': [{
          title: '保险公司名称',
          input: '',
          type: 'text'
        }, {
          title: '投保时间',
          input: '',
          type: 'date'
        }, {
          title: '投保险种',
          input: '',
          type: 'text'
        }, {
          title: '已投保身故保险金额总和',
          input: '',
          type: 'text'
        }]
      },
      allNo: false,
      showPup0ver: false,
      matters: [], //健康告知问题
      clientvalue: {
        ass_amswer: {}, //被保险人勾选
        fields: {}, //被保人用户字段
        app_amswer: {}, //投保人勾选
        app_fields: {} //投保人填写字段
      },
      isExempted: false // 是否豁免投保人
    }
  },
  computed: {
    age() {
      var birthday = this.$store.state.assured.birthday
      return birthday ? (new Date().getFullYear() - birthday.substr(0, 4)) : 20
    }
  },
  watch: {
    allNo(val) {
      if (val === true) {
        this.clientvalue.ass_amswer = {}
        this.clientvalue.fields = {}
        this.clientvalue.app_amswer = {}
        this.clientvalue.app_fields = {}
      }
    },
    clientvalue: {
      handler(val) {
        this.save2local('clientvalue', val)
      },
      deep: true
      // immediate: true
    }
  },
  created() {
    const vm = this
    Api.queryMatters(res => {
      if (res.name && res.name.indexOf('Error') > -1) {
        vm.$toast.open('服务器开小差了', 'error')
        return
      }
      vm.matters = res.filter(matter => {
        return matter.version === '2'
      })
      vm.$store.dispatch('saveMatters', Api.obj2json(vm.matters))
    })
    if (this.$store.state.todo) {
      this.setData('clientvalue', this.$storage.fetch('clientvalue'))
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/beneficiaries') {
      next()
      return false
    }
    if (!this.checkForm()) {
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
      this.allNo = false

      // 如果为否
      if (val[id] === false) {
        var forms = this.forms[id]
        for (var i in forms) {
          forms[i].input = ''
        }
        this.$set(this.clientvalue.ass_amswer, id, false)
        this.$set(this.clientvalue.fields, id, '')
      } else if (['3', '4', '5', '6', '7', '8', '9', '10', '16'].indexOf(id) > -1) {
        // 为是且有必填项
        this.showPup0ver = true
        this.$refs['form' + id][0].show = true
      } else {
        this.$set(this.clientvalue.ass_amswer, id, true)
        this.save2local('clientvalue', this.clientvalue)
      }
      this.$forceUpdate()
    },
    checkForm() {
      var bools = this.clientvalue.ass_amswer
      var allFalse = true
      for (var i in bools) {
        if (bools[i] === true) {
          allFalse = false
        }
      }
      if (!this.allNo && allFalse) {
        this.$toast.open('全为否，请选中下方按钮', '')
        return false
      }
      return true
    }
  }
}
</script>
<style lang="scss">
.app {
  &-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(150, 150, 150, .5);
  }
  &-pupover {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 101;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .am-list:not([am-version]) {
      padding-bottom: 0;
      position: relative;
    }
  }
}
</style>
