<template>
  <section id="Beneficiaries">
    <div class="am-list am-list-6lb form">
      <div class="app-list-header">身故受益人类型</div>
      <div class="am-list-body" aria-labelledby="demo-cb-header-1">
        <label class="am-list-item check">
          <div class="am-list-content">法定受益人</div>
          <div class="am-checkbox">
            <input type="radio" name="benefic" value="1" v-model="is_legal_benefic">
            <span class="icon-check" aria-hidden="true"></span>
          </div>
        </label>
        <label class="am-list-item check">
          <div class="am-list-content">指定受益人</div>
          <div class="am-checkbox">
            <input type="radio" name="benefic" value="0" v-model="is_legal_benefic">
            <span class="icon-check" aria-hidden="true"></span>
          </div>
        </label>

      </div>
    </div>

    <app-beneficiary v-show="is_legal_benefic === '0'" ref=child :key="person" v-for='person,index in people' :people='person' :BfIndex='index'></app-beneficiary>
    <div class="am-button-group" role="group" v-show="is_legal_benefic === '0'" style="margin-bottom: .1rem">
      <a @click="add" class="am-button white" role="button"><span class="app-iconfont">&#xe667;</span> 添加受益人 </a>
    </div>

    <div class="am-button-group" role="group" aria-label="操作按钮组">
      <button type="button" class="am-button white"><router-link to="/prospectus">上一步</router-link></button>
      <button type="button" class="am-button blue"><router-link to="/healthinfo">下一步</router-link></button>
    </div>
  </section>
</template>
<script>
import Beneficiary from './Beneficiary'
import Api from '../api'

export default {
  name: 'Beneficiaries',
  components: {
    'app-beneficiary': Beneficiary
  },
  data() {
    return {
      beneficiaries: [],
      is_legal_benefic: '1'
    }
  },
  computed: {
    people() {
      return this.$store.state.tmp.people
    }
  },
  methods: {
    add() {
      var vm = this
      for (var i in this.$refs.child) {
        if (!this.$refs.child[i].checkForm()) {
          return false
        }
      }
      vm.$dialog.open('确认添加受益人吗？', '', function() {
        vm.$store.commit('addBeneficiary')
        vm.$refs.child.forEach($vm => {
          $vm.$data.beneficiary.ratio = (100 / vm.$store.state.tmp.people.length).toFixed(0)
        })
        return
      })
    },
    checkRatio() {
      let benefited = {}
      for (var i = 1; i <= 10; i++) {
        benefited[i] = []
      }
      this.$refs.child.forEach(vm => {
        benefited[vm.$data.beneficiary.sort_order].push(Number(vm.$data.beneficiary.rate))
      })
      for (var j = 1; j <= 10; j++) {
        var sum = 0
        for (var k = 0; k < benefited[j].length; k++) {
          sum += benefited[j][k]
        }
        if (sum !== 100 && benefited[j].length > 0) {
          this.$toast.open('受益顺序为' + j + '的受益人的受益份额和为100%', 'warn')
          return false
        }
      }
      return true
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/prospectus') {
      next()
      return false
    }
    let vm = this
    let type = vm.is_legal_benefic
    if (type === '0') {
      let children = vm.$refs.child
      for (let index in children) {
        if (children[index].beneficiary.ID_no === vm.$store.state.assured.insured_ID_no && children[index].beneficiary.fullname === vm.$store.state.assured.insured_name) {
          vm.$toast.open('受益人和被保险人不能是同一人', 'warn')
          return false
        }
        if (!children[index].checkForm()) {
          return false
        }
        children[index].$emit('save')
        if (Number(index) === children.length - 1) {
          vm.$store.commit('saveBeneficiary', Api.obj2json(vm.beneficiaries))
          if (!this.checkRatio()) return
          next()
        }
      }
    } else {
      next()
    }
  }
}
</script>
