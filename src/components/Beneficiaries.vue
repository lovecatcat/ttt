<template>
  <section id="Beneficiaries">
    <div class="app-list-header am-flexbox">
      <div class="am-flexbox-item"><span class="app-iconfont">&#xe631;</span>身故受益人信息</div>
    </div>
    <div class="am-list">
      <div class="am-list-header">身故受益人类型</div>
      <div class="am-list-body">
        <label class="am-list-item radio">
          <div class="am-list-content">法定受益人</div>
          <div class="am-checkbox">
            <input type="radio" value="0" v-model="warranty.benefited_type">
            <span class="icon-check"></span>
          </div>
        </label>
        <label class="am-list-item radio">
          <div class="am-list-content">指定受益人</div>
          <div class="am-checkbox">
            <input type="radio" value="1" v-model="warranty.benefited_type">
            <span class="icon-check"></span>
          </div>
        </label>
      </div>
    </div>
    <app-beneficiary v-show="warranty.benefited_type === '1'" ref=child :key="person" v-for='person,index in people' :people='person' :index='index'></app-beneficiary>
    <div class="am-button-group" role="group" v-show="warranty.benefited_type === '1'">
      <a @click="add" class="am-button" role="button"><span class="app-iconfont">&#xe667;</span> 继续添加 </a>
    </div>
    <div class="am-tab am-fixed am-fixed-bottom app-navi">
      <router-link to="/prospectus" class="am-tab-item">上一步</router-link>
      <router-link to="/healthinfo" class="am-tab-item selected">下一步</router-link>
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
      warranty: {
        benefited_type: '0' //身故受益人类型：默认法定
      }
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
          $vm.$data.beneficiary.benefited_ratio = (100 / vm.$store.state.tmp.people.length).toFixed(0)
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
        benefited[vm.$data.beneficiary.benefited_level].push(Number(vm.$data.beneficiary.benefited_ratio))
      })
      for (var j = 1; j <= 10; j++) {
        var sum = 0
        for (var k = 0; k < benefited[j].length; k++) {
          sum += benefited[j][k]
        }
        if (sum !== 100 && benefited[j].length > 0) {
          this.$toast.open('受益顺序为' + j + '的受益人的受益份额和为100%', '')
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
    let type = vm.warranty.benefited_type
    if (type === '1') {
      let children = vm.$refs.child
      for (let index in children) {
        if (children[index].beneficiary.document_number === vm.$store.state.assured.document_number && children[index].beneficiary.name === vm.$store.state.assured.name) {
          vm.$toast.open('受益人和被保险人不能是同一人', '')
          return false
        }
        if (!children[index].checkForm()) {
          return false
        }
        children[index].$emit('save')
        if (Number(index) === children.length - 1) {
          vm.$store.commit('saveBeneficiary', Api.obj2json(vm.beneficiaries))
          if (!this.checkRatio()) return
          vm.$store.commit('setWarranty', vm.warranty)
          next()
        }
      }
    } else {
      vm.$store.commit('setWarranty', vm.warranty)
      next()
    }
  }
}
</script>
