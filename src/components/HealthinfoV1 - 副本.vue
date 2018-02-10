<template>
  <div id="HealthinfoV1">
    <div class="app-list-header am-flexbox">
      <div class="am-flexbox-item"><span class="app-iconfont">&#xe631;</span>投保人健康告知</div>
    </div>
    <div v-show="showPup0ver" class="app-mask"></div>
    <div class="am-list am-list-6lb form" v-for="item,index in matters">
      <div class="am-list-item">
        <div class="app-list-title">{{item.entry}}. {{item.content}} <span class="am-ft-red">{{item.answer}}</span>
        </div>
      </div>
      <template v-if="item.child">
        <div class="am-list-body" v-for="childitem in item.child">
          <div class="am-list-item">
            <div class="app-list-title">{{childitem.entry}}. {{childitem.content}}</div>
          </div>
          <div class="am-list-item" v-if="clientvalue.fields[childitem.ci_id]">
            <div class="am-ft-md qaline"><span class="am-ft-red" v-html="clientvalue.fields[childitem.ci_id]"></span>
            </div>
          </div>
          <app-form :ref="'form'+childitem.ci_id"
                    :k="'assu'+childitem.ci_id"
                    v-if="forms[item.entry]"
                    :forms="forms[item.entry]"
                    :index="childitem.ci_id">
            <button slot="cancel" type="button" class="am-button tiny" @click="showPup0ver = false">取消</button>
          </app-form>
          <div class="app-list" v-if="isExempted">
            <div class="app-list-title">投保人</div>
            <div class="am-switch">
              <input type="checkbox"
                     v-model="clientvalue.app_amswer[childitem.ci_id]"
                     @change="appChanged(clientvalue.app_amswer,childitem.ci_id, childitem.entry)"
                     :value="childitem.ci_id"
                     class="am-switch-checkbox"
                     :id="'appmatter'+childitem.ci_id">
              <label class="am-switch-label" :for="'appmatter'+childitem.ci_id">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
          <div class="am-list-item" v-if="clientvalue.app_fieldsclientvalue.app_fields[childitem.ci_id]">
            <div class="am-ft-md"><span class="am-ft-red" v-html="clientvalue.app_fields[childitem.ci_id]"></span></div>
          </div>
          <app-form who="appl"
                    :ref="'appform'+childitem.ci_id"
                    :k="'appl'+childitem.ci_id"
                    v-if="appForms[item.entry]"
                    :forms="appForms[item.entry]"
                    :index="childitem.ci_id"
          >
            <button slot="cancel" type="button" class="am-button tiny" @click="showPup0ver = false">取消</button>
          </app-form>
        </div>
      </template>
      <template v-else>
        <div class="am-list-body">
          <div class="am-list-item" v-if="clientvalue.fields[item.ci_id]">
            <div class="am-ft-md qaline"><span class="am-ft-red" v-html="clientvalue.fields[item.ci_id]"></span></div>
          </div>
          <app-form :ref="'form'+item.ci_id"
                    :k="'assu'+item.ci_id"
                    v-if="forms[item.entry]"
                    :forms="forms[item.entry]"
                    :index="item.ci_id"
          >
            <button slot="cancel" type="button" class="am-button tiny" @click="showPup0ver = false">取消</button>
          </app-form>
          <div class="app-list" v-if="isExempted">
            <div class="app-list-title">投保人</div>
            <div class="am-switch">
              <input type="checkbox" v-model="clientvalue.app_amswer[item.ci_id]"
                     @change="appChanged(clientvalue.app_amswer,item.ci_id, item.entry)" :value="item.ci_id"
                     class="am-switch-checkbox" :id="'appmatter'+item.ci_id">
              <label class="am-switch-label" :for="'appmatter'+item.ci_id">
                <div class="am-switch-inner"></div>
                <div class="am-switch-switch"></div>
              </label>
            </div>
          </div>
          <div class="am-list-item" v-if="clientvalue.app_fields[item.ci_id]">
            <div class="am-ft-md"><span class="am-ft-red" v-html="clientvalue.app_fields[item.ci_id]"></span></div>
          </div>
          <app-form who="appl"
                    :ref="'appform'+item.ci_id"
                    :k="'appl'+item.ci_id"
                    v-if="appForms[item.entry]"
                    :forms="appForms[item.entry]"
                    :index="item.ci_id"
          >
            <button slot="cancel" type="button" class="am-button tiny" @click="showPup0ver = false">取消</button>
          </app-form>
        </div>
      </template>
    </div>
    <div class="app-agreement" v-if="isExempted">
      <div class="am-checkbox mini argument">
        <input id="agreeappl" type="checkbox" v-model="applAllNo">
        <span class="icon-check"></span>
        <label class="am-ft-md" for="agreeappl">【投保人】告知事项全是否</label>
      </div>
    </div>
    <div class="app-agreement am-list">
      <div class="am-checkbox mini argument">
        <input id="promise" type="checkbox" v-model="promise">
        <span class="icon-check"></span>
        <label class="am-ft-md" for="promise">用户承诺</label>
      </div>
      <div class="am-list-item">
        <div class="am-ft-sm">1. 本人承诺上述内容与客户告知事实一致，并无虚假和重大遗漏。
          <br>2. 本人愿意承担因不实告知带来的所有责任。
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

  const noNeedAnswer = ['11', '12', '14']
  const needAnswer = {
    '1': [{
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
      type: 'select',
      options: ['治愈', '好转', '未愈']
    }],
    '2': [{
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
    '3': [{
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
      type: 'select',
      options: ['治愈', '好转', '未愈']
    }],
    '4': [{
      title: '怀孕(周)',
      input: '',
      type: 'number',
      ci_id: '32'
    }, {
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
      type: 'select',
      options: ['治愈', '好转', '未愈']
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
      type: 'select',
      options: ['治愈', '好转', '未愈']
    }]
  }

  export default {
    name: 'HealthinfoV1',
    components: {
      'app-form': {
        template: `
        <div class="app-pupover" v-show="show">
          <div class="am-list form">
            <template v-for="item in forms">
              <template v-show="index=='32'&&item.ci_id=='32'" v-if="index=='32'&&item.ci_id=='32'">
                <app-input :label="item.title">
                  <input slot="input" v-model="item.input" type="number" placeholder="必填">
                  <div slot="icon" class="am-list-clear" @click="item.input = ''"><i class="am-icon-clear am-icon"></i></div>
                </app-input>
              </template>
              <template v-show="index!='32'" v-if="index!='32'&&item.ci_id!='32'">
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
                <app-input :label="item.title" v-else-if="item.type=='number'">
                  <input slot="input" v-model="item.input" type="number" placeholder="必填">
                  <div slot="icon" class="am-list-clear" @click="item.input = ''"><i class="am-icon-clear am-icon"></i></div>
                </app-input>
                <app-input :label="item.title" v-else-if="item.type=='text'">
                  <input slot="input" v-model="item.input" type="text" placeholder="必填">
                  <div slot="icon" class="am-list-clear" @click="item.input = ''"><i class="am-icon-clear am-icon"></i></div>
                </app-input>
                <app-select :label="item.title" v-else-if="item.type=='select'">
                  <select v-model="item.input" >
                    <option disabled value="">请选择</option>
                    <option v-for="(ite,ind) in item.options" :value="ite" :key="ind">{{ite}}</option>
                  </select>
                </app-select>
              </template>
            </template>
            <div class="am-button-group">
              <button type="button" class="am-button tiny" @click="cancel">取消</button>
              <button type="button" class="am-button tiny" @click="confirm">确定</button>
            </div>
          </div>
        </div>
        `,
        props: ['forms', 'index', 'who'],
        data () {
          return {
            show: false
          }
        },
        methods: {
          cancel () {
            this.show = false
            this.$parent.showPup0ver = false
            this.$parent.clientvalue.fields[this.index] = ''
          },
          confirm () {
            if (!this.checkForm()) {
              return false
            }
            this.show = false
            this.$parent.showPup0ver = false
          },
          checkForm () {
            console.log(typeof this.index)
            let bool = true
            let field = ''
            for (let i in this.forms) {
              let j = this.forms[i]
              if (this.index === '32' && !this.forms[0].input) {
                this.$toast.open('请填写' + j.title, '')
                bool = false
                break
              } else if ((this.index === '33' || this.index === '34') && i > 0 && !j.input) {
                this.$toast.open('请填写' + j.title, '')
                bool = false
                break
              } else if (['32', '33', '34'].indexOf(this.index) === -1 && !j.input && j.type !== 'radio') {
                this.$toast.open('请填写' + j.title, '')
                bool = false
                break
              }
              console.count('checkForm')
              let text
              if (j.type === 'radio') {
                text = j.input === true ? '是' : '否'
              } else {
                text = j.input
//                j.input = ''
              }
              if (this.index === '33' || this.index === '34') {
                if (i > 0) {
                  field += j.title + '：' + text + '\t'
                }
              } else if (this.index !== '32') {
                field += j.title + '：' + text + '\t'
              }
            }
            if (this.index === '32') {
              field += this.forms[0].title + '：' + this.forms[0].input + '\t'
            }
            // 合并输入内容
            this.$set(this.$parent.clientvalue.fields, this.index, field)
            return bool
          }
        }
      }
    },
    data () {
      return {
        isExempted: false,
        forms: needAnswer,
        appForms: Api.obj2json(needAnswer),
        applAllNo: null,
        promise: false,
        showPup0ver: false,
        matters: [], //健康告知问题
        clientvalue: {
          app_amswer: {}, //投保人勾选
          app_fields: {} //投保人填写字段
        }
      }
    },
    activated () {
      this.isExempted = false
      for (let i in this.$store.state.insurances) {
        console.log(this.$store.state.insurances[i].safe_id)
        if (this.$store.state.insurances[i].safe_id === '370') {
          this.isExempted = true
        }
      }
    },
    computed: {
      age () {
        let birthday = this.$store.state.assured.birthday
        return birthday ? (new Date().getFullYear() - birthday.substr(0, 4)) : 20
      }
    },
    watch: {
      applAllNo (val) {
        if (val === true) {
          this.clientvalue.app_amswer = {}
          this.clientvalue.app_fields = {}
        }
      },
      clientvalue: {
        handler (val) {
          this.save2local('clientvalue', val)
        },
        deep: true
      }
    },
    created () {
      const vm = this
      Api.queryMatters(res => {
        if (res.name && res.name.indexOf('Error') > -1) {
          vm.$toast.open('服务器开小差了', 'error')
          return
        }
        vm.matters = res.filter(matter => {
          return matter.version === '10'
        })
        vm.$store.dispatch('saveMatters', Api.obj2json(vm.matters))
      })
      if (this.$store.state.todo) {
        this.setData('clientvalue', this.$storage.fetch('clientvalue'))
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/beneficiaries') {
        next()
        return false
      }
      this.$nextTick(() => {
        document.body.scrollTop = document.body.scrollHeight
      })
      if (!this.checkForm()) {
        return false
      }
      this.$store.commit('saveClientValue', Api.obj2json(this.clientvalue))
      next()
    },
    methods: {
      appChanged (val, id, entry) {
        this.applAllNo = false
        // 如果为否
        if (val[id] === false) {
          var forms = this.appForms[id]
          for (var i in forms) {
            forms[i].input = ''
          }
          this.$set(this.clientvalue.app_amswer, id, false)
          this.$set(this.clientvalue.app_fields, id, '')
        } else if (noNeedAnswer.indexOf(entry) === -1) {
          // 为是且有必填项
          this.showPup0ver = true
          console.log(this.$refs['appform' + id])
          this.$refs['appform' + id][0].show = true
        } else {
          this.$set(this.clientvalue.app_amswer, id, true)
          this.save2local('clientvalue', this.clientvalue)
        }
        this.$forceUpdate()
      },
      checkForm () {
        if (this.isExempted) {
          let applBools = this.clientvalue.app_amswer
          let applAllFalse = true
          for (let i in applBools) {
            if (applBools[i] === true) {
              applAllFalse = false
            }
          }
          if (!this.applAllNo && applAllFalse) {
            this.$toast.open('投保人告知项全为否，请选中下方按钮', '')
            return false
          }
        }

        if (!this.promise) {
          this.$toast.open('请阅读用户承诺并确认', '')
          return false
        }
        return true
      }
    }
  }
</script>
<style lang="scss">
  .qaline {
    border-bottom: 1px solid #eee;
    padding-bottom: .12rem;
  }

  .app {
  &-mask {
     position: fixed;
     top: 0;
     bottom: 0;
     left: 0;
     right: 0;
     z-index: 99;
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
    width: 96%;
  }
  }
  }
</style>
