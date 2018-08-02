<template>
  <section id="Healthinfo">
    <app-dropdown up='up'>
      <template slot="header">
        <div class="am-list-label">被保人 — 健康告知</div>
      </template>
      <div class="am-list-body" v-for="item,index in matters" v-if="isShow(item.entry,2)" style="border-bottom: solid 1px #e4e4e4">
        <div class="am-list-item am-list-control-button" style="padding-top: 0 !important;align-items:flex-start;">
          <div class="app-list-title">
            {{item.entry}}. {{item.content}}
            {{item.answer}}
            <template v-if="item.child">
              <div v-for="childitem in item.child" :key="childitem.id">
                {{childitem.entry}}. {{childitem.content}}
              </div>
            </template>
          </div>
          <div class="am-list-control app-list-button">
            <button slot="button" class="am-button tiny" :class="{'tiny-blue':clientvalue.ass_amswer[item.id]}"
                    :disabled="clientvalue.ass_amswer[item.id]" @click="assChange(item.id,true),toblur()">是</button>
            <button slot="button" class="am-button tiny" :class="{'tiny-blue':!clientvalue.ass_amswer[item.id]}"
                    :disabled="!clientvalue.ass_amswer[item.id]" @click="assChange(item.id,false),toblur()">否</button>
          </div>
        </div>
        <template v-if="assforms[item.id] && clientvalue.ass_amswer[item.id]">
          <app-form :k="'assu'+item.id" :forms="assforms[item.id]" :index="item.id"></app-form>
        </template>
      </div>
    </app-dropdown>
    <app-dropdown up='down' v-if="isExempted" >
      <template slot="header">
        <div class="am-list-label">投保人 — 健康告知</div>
      </template>
      <div class="am-list-body" v-for="item,index in matters" v-if="isShow(item.entry,1)" style="border-bottom: solid 1px #e4e4e4">
        <div class="am-list-item am-list-control-button" style="padding-top: 0 !important;align-items:flex-start;">
          <div class="app-list-title">
            {{item.entry}}. {{item.content}}
            {{item.answer}}
            <template v-if="item.child">
              <div v-for="childitem in item.child" :key="childitem.id">
                {{childitem.entry}}. {{childitem.content}}
              </div>
            </template>
          </div>
          <div class="am-list-control app-list-button">
            <button slot="button" class="am-button tiny" :class="{'tiny-blue':clientvalue.app_amswer[item.id]}"
                    :disabled="clientvalue.app_amswer[item.id]" @click="appChange(item.id,true),toblur()">是</button>
            <button slot="button" class="am-button tiny" :class="{'tiny-blue':!clientvalue.app_amswer[item.id]}"
                    :disabled="!clientvalue.app_amswer[item.id]" @click="appChange(item.id,false),toblur()">否</button>
          </div>
        </div>
        <template v-if="appforms[item.id] && clientvalue.app_amswer[item.id]">
          <app-form :k="'assu'+item.id" :forms="appforms[item.id]" :index="item.id"></app-form>
        </template>
      </div>
    </app-dropdown>
    <div class="am-list am-list-6lb form am-list-last">
      <div class="app-list-brief">
        1. 本人承诺上述内容与客户告知事实一致，并无虚假和重大遗漏。 <br>2. 本人愿意承担因不实告知带来的所有责任。
      </div>
      <div class="app-agreement">
        <div class="am-checkbox mini argument">
          <input id="promise" type="checkbox" v-model="promise">
          <span class="icon-check"></span>
          <label class="am-ft-md " for="promise">用户承诺</label>
        </div>
      </div>
    </div>

    <div class="am-button-group" role="group" aria-label="操作按钮组">
      <button type="button" class="am-button white"><router-link to="/beneficiaries">上一步</router-link></button>
      <!--<button type="button" class="am-button blue" v-if="diffHealth"> <router-link to="/healthinfov1">下一步</router-link></button>-->
      <button type="button" class="am-button blue"> <router-link to="/billinfo">下一步</router-link></button>
    </div>
  </section>
</template>
<script>
  import Api from '../api'

  const needAnswer = {
    '10': [{
      title: '每天吸烟(支)',
      type: 'number',
      msg: '请输入吸烟数量, 保留整数',
      reg: /^\d+$/,
      value: ''
    }, {
      title: '烟龄(年)',
      type: 'number',
      msg: '请输入烟龄, 保留整数',
      reg: /^\d+$/,
      value: ''
    }],
    '11': [{
      title: '每天饮酒(两)',
      type: 'number',
      msg: '请输入每天饮酒量, 保留整数',
      reg: /^\d+$/,
      value: ''
    }, {
      title: '酒龄',
      type: 'number',
      msg: '请输入酒龄, 保留整数',
      reg: /^\d+$/,
      value: ''
    }],
    '12': [{
      title: '检查原因',
      value: '',
      type: 'text'
    }, {
      title: '检查时间',
      value: '',
      type: 'date'
    }, {
      title: '检查地点',
      value: '',
      type: 'text'
    }, {
      title: '检查结果',
      value: '',
      type: 'text'
    }],
    '15': [{
      title: '住院时间',
      value: '',
      type: 'date'
    }, {
      title: '原因',
      value: '',
      type: 'text'
    }, {
      title: '医院名称',
      value: '',
      type: 'text'
    }, {
      title: '目前状况',
      value: '',
      type: 'select',
      options: ['治愈', '好转', '未愈']
    }],
    '16': [{
      title: '是否住院',
      value: '',
      type: 'radio'
    }, {
      title: '发病时间',
      value: '',
      type: 'date'
    }, {
      title: '疾病名称',
      input: '',
      type: 'text'
    }, {
      title: '诊疗医院',
      value: '',
      type: 'text'
    }, {
      title: '目前状况',
      value: '',
      type: 'select',
      options: ['治愈', '好转', '未愈']
    }],
    '29': [{
      title: '智障等级',
      value: '',
      type: 'text'
    }, {
      title: '残疾部位',
      value: '',
      type: 'text'
    }, {
      title: '原因',
      value: '',
      type: 'text'
    }, {
      title: '程度',
      value: '',
      type: 'text'
    }],
    '30': [{
      title: '药物名称',
      value: '',
      type: 'text'
    }, {
      title: '使用时间',
      value: '',
      type: 'date'
    }, {
      title: '目前状况',
      value: '',
      type: 'select',
      options: ['治愈', '好转', '未愈']
    }],
    '31': [{
      title: '怀孕(周)',
      value: '',
      type: 'number',
      ci_id: '32'
    }, {
      title: '是否住院',
      value: '',
      type: 'radio'
    }, {
      title: '发病时间',
      value: '',
      type: 'date'
    }, {
      title: '疾病名称',
      value: '',
      type: 'text'
    }, {
      title: '诊疗医院',
      value: '',
      type: 'text'
    }, {
      title: '目前状况',
      value: '',
      type: 'select',
      options: ['治愈', '好转', '未愈']
    }],
    '35': [{
      title: '是否住院',
      value: '',
      type: 'radio'
    }, {
      title: '发病时间',
      value: '',
      type: 'date'
    }, {
      title: '疾病名称',
      value: '',
      type: 'text'
    }, {
      title: '诊疗医院',
      value: '',
      type: 'text'
    }, {
      title: '目前状况',
      value: '',
      type: 'select',
      options: ['治愈', '好转', '未愈']
    }],
    '38': [{
      title: '与被保人关系',
      value: '',
      type: 'text'
    }, {
      title: '患病时间',
      value: '',
      type: 'date'
    }, {
      title: '疾病名称',
      value: '',
      type: 'text'
    }, {
      title: '目前状况',
      value: '',
      type: 'select',
      options: ['治愈', '好转', '未愈']
    }],
    '41': [{
      title: '事故发生时间',
      value: '',
      type: 'date'
    }, {
      title: '受伤情况',
      value: '',
      type: 'text'
    }, {
      title: '目前状况',
      value: '',
      type: 'select',
      options: ['治愈', '好转', '未愈']
    }],
    '43': [{
      title: '特殊人群类型',
      value: '',
      type: 'select',
      options: ['高龄人员', '残疾人员', '低保人员']
    }],
    '44': [{
      title: '保险公司名称',
      value: '',
      type: 'text'
    }, {
      title: '投保时间',
      value: '',
      type: 'date'
    }, {
      title: '投保险种',
      value: '',
      type: 'text'
    }, {
      title: '已投保身故保险金额总和',
      value: '',
      type: 'number'
    }]
  }

  export default {
    name: 'Healthinfo',
    components: {
      'app-form': {
        template: `

        <div >
            <div  v-for="item in forms">
              <template v-show="index=='32'&&item.ci_id=='32'" v-if="index=='32'&&item.id=='32'">
                <app-input :label="item.title">
                  <input slot="input" v-model="item.value" type="number" placeholder="必填">
                  <div slot="icon" class="am-list-clear" v-show="item.value" @click="item.value = ''"><i class="iconfont icon-chahao"></i></div>
                </app-input>
              </template>
              <template v-show="index!='32'" v-if="index!='32'&&item.id!='32'">
                <div class="am-list-item" v-if="item.value=='radio'">
                  <div class="am-list-content">{{item.title}}</div>
                  <div class="am-switch">
                    <input type="checkbox" v-model="item.value" class="am-switch-checkbox" :id="'item'+index">
                    <label class="am-switch-label" :for="'item'+index">
                      <div class="am-switch-inner"></div>
                      <div class="am-switch-switch"></div>
                    </label>
                  </div>
                </div>
                <app-input :label="item.title" v-else-if="item.type=='date'">
                  <input slot="input" :class="{'has':item.value != ''}" v-model="item.value" type="date" placeholder="请选择时间">
                  <div slot="icon" class="am-list-clear" v-show="item.value" @click="item.input = ''"><i class="iconfont icon-chahao"></i></div>
                </app-input>
                <app-input :label="item.title" v-else-if="item.type=='number'">
                  <input slot="input" v-model="item.value" type="number" placeholder="必填">
                  <div slot="icon" class="am-list-clear" v-show="item.value" @click="item.value = ''"><i class="iconfont icon-chahao"></i></div>
                </app-input>
                <app-input :label="item.title" v-else-if="item.type=='text'">
                  <input slot="input" v-model="item.value" type="text" placeholder="必填">
                  <div slot="icon" class="am-list-clear" v-show="item.value" @click="item.value = ''"><i class="iconfont icon-chahao"></i></div>
                </app-input>
                <app-select :label="item.title" v-else-if="item.type=='select'">
                  <select v-model="item.value" >
                    <option disabled value="">请选择</option>
                    <option v-for="(ite,ind) in item.options" :value="ite" :key="ind">{{ite}}</option>
                  </select>
                  <div slot="icon" class="am-list-clear" @click="item.value = ''"><i class="iconfont icon-xiajiantou"></i></div>
                </app-select>
              </template>
            </div >

        </div>
        `,
        props: ['forms', 'index', 'who'],
        data() {
          return {
            show: false
          }
        }
      }
    },
    data() {
      return {
        isExempted: false, //是否有豁免
        appforms: Api.obj2json(needAnswer),
        assforms: Api.obj2json(needAnswer),
        promise: false,
        matters: [], //健康告知问题
        clientvalue: {
          ass_amswer: {}, //被保险人勾选
          fields: {}, //被保人用户字段
          app_amswer: {}, //投保人勾选
          app_fields: {} //投保人填写字段
        }
      }
    },
    activated() {
      this.isExempted = false
      for (let i in this.$store.state.insurances) {
        console.log(this.$store.state.insurances[i].safe_id)
        if (this.$store.state.insurances[i].code === '33F00030') {
          this.isExempted = true
        }
      }
    },
    computed: {
      applAge() {
        let birthday = this.$store.state.applicant.birthday
        return birthday ? this.getAge(birthday) : 0
      },
      assuAge() {
        let birthday = this.$store.state.assured.birthday
        return birthday ? this.getAge(birthday) : 0
      },
      isAssuWm() {
        let sex = this.$store.state.assured.insured_gender
        return sex
      },
      isApplWm() {
        let sex = this.$store.state.applicant.holder_gender
        return sex
      }
    },
    created() {
      const vm = this
      Api.queryMatters(res => {
        vm.matters = res.data
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
      this.$nextTick(() => {
        document.body.scrollTop = document.body.scrollHeight
      })
      if (!this.checkForm()) {
        return false
      }
      let appitems = []
      let vm = this
      this.matters.forEach(function (item, index) {
        let insured_answer = vm.clientvalue.ass_amswer[item.id] ? '1' : '0'
        let holder_answer = vm.clientvalue.app_amswer[item.id] ? '1' : '0'
        let insured_fields = vm.clientvalue.fields[item.id] ? vm.clientvalue.fields[item.id] : ''
        let holder_fields = vm.clientvalue.app_fields[item.id] ? vm.clientvalue.app_fields[item.id] : ''
        appitems.push({
          mv_id: item.id,
          insured_answer: insured_answer,
          holder_answer: holder_answer,
          insured_fields: insured_fields,
          holder_fields: holder_fields
        })
      })
      this.$store.commit('saveClientValue', Api.obj2json(appitems))
      next()
    },
    methods: {
      //失去焦点
      toblur() {
        document.activeElement.blur()
      },
      isShow(i, type) {
        //type 2被保人
        // if (i === 0 || i === 12) {
        //   return false
        // }
        if (i === '8' && type === 1 && this.isApplWm !== 'LAB0010') {
          return false
        }
        if (i === '9' && type === 1 && this.applAge > 2) {
          return false
        }
        if (i === '16' && type === 1 && this.applAge < 18) {
          return false
        }
        if (i === '8' && type === 2 && (this.isAssuWm !== 'LAB0010' || this.assuAge < 12)) {
          return false
        }
        if (i === '9' && type === 2 && this.assuAge > 2) {
          return false
        }
        if (i === '16' && type === 2 && this.assuAge < 18) {
          return false
        }
        return true
      },
      change(item) {
        let ret = {
          status: true,
          msg: ''
        }
        if (item.must === false) {
          return ret
        }
        // let reg = item.reg
        let msg = ''
        if (item.type === 'number' && !/^\d+\.?\d*$/.test(item.value)) {
          msg = item.msg || '请输入正确的数字'
          ret = { status: false, msg }
        } else if (item.type === 'text' && !item.value) {
          msg = item.msg || '请输入' + item.title
          ret = { status: false, msg }
        } else if (item.type === 'date' && !/^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/.test(item.value)) {
          msg = '请输入日期，形如 1999-12-31'
          ret = { status: false, msg }
        } else if (item.type === 'textarea' && !item.value) {
          msg = '请完成说明'
          ret = { status: false, msg }
        } else if (item.type === 'select' && !item.value) {
          msg = '请完成选择'
          ret = { status: false, msg }
        }
        // if (toast_text) {
        //   this.$toast.open(toast_text, 'warn')
        //   return false
        // }
        return ret
      },
      appChange(id,state) {
        this.clientvalue.app_amswer[id] = state
        this.$forceUpdate()
      },
      assChange(id,state) {
        this.clientvalue.ass_amswer[id] = state
        this.$forceUpdate()
      },
      getIndex(id, chief) {
        for (let i in this.matters) {
          let item = this.matters[i]
          if (item.id === id && !chief) {
            return item.entry
          }
          if (item.id === chief) {
            for (let j = 0; j < item.child.length; j++) {
              if (item.child[j].id === id) {
                return i + item.child[j].entry
              }
            }
          } ``
        }
      },
      kuohaoFilter(val) {
        val = val.toString()
        if (!val) return ''
        let len = val.length
        let leftk = val.indexOf('(')
        let rightk = val.indexOf(')')
        if (leftk !== 0) {
          val = '(' + val
        }
        if (rightk !== (len - 1)) {
          val = val + ')'
        }
        return val
      },
      checkForm() {
        let toast_text = null
        let input = null
        let title = ''
        let msg = ''

        for (let i in this.clientvalue.ass_amswer) {
          if (this.clientvalue.ass_amswer[i] === true) {
            let item = this.assforms[i]
            if (item && item.length) {
              let val = []
              for (let k = item.length - 1; k >= 0; k--) {
                input = item[k]
                title = input.title ? input.title : ''
                let who = '被保人'
                msg = '问题' + this.getIndex(Number(i), Number(input.chief)) + who + title + ','

                if (input.must !== false || input.value) {
                  let ret = this.change(input)
                  console.log(ret)
                  if (!ret.status) {
                    toast_text = msg + ret.msg
                    break
                  }
                }
                val.push(input.type !== 'textarea' ? input.value : this.kuohaoFilter(input.value))
              }
              this.clientvalue.fields[i] = val.reverse().join('|')
            }
          } else {
            this.clientvalue.fields[i] = ''
          }
        }

        if (this.isExempted) {
          for (let j in this.clientvalue.app_amswer) {
            if (this.clientvalue.app_amswer[j] === true) {
              let jitem = this.appforms[j]
              if (jitem && jitem.length) {
                let jval = []
                for (let l = jitem.length - 1; l >= 0; l--) {
                  input = jitem[l]
                  title = input.title ? input.title : ''
                  msg = '投保人问题 ' + this.getIndex(Number(j), Number(input.chief)) + ' ' + title + '，'

                  if (input.must !== false || input.value) {
                    let jret = this.change(input)
                    if (!jret.status) {
                      toast_text = msg + jret.msg
                      break
                    }
                  }

                  jval.push(input.type !== 'textarea' ? input.value : this.kuohaoFilter(input.value))
                }
                this.clientvalue.app_fields[j] = jval.reverse().join('|')
              }
            } else {
              this.clientvalue.app_fields[j] = ''
            }
          }
        }
        if (toast_text) {
          this.$toast.open(toast_text, 'warn')
          return false
        }
        if (!this.promise) {
          this.$toast.open('请阅读用户承诺并确认', 'warn')
          return false
        }
        return true
      }
    }
  }
</script>
<style lang="scss">
  .overflowhide{overflow: hidden;}
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
