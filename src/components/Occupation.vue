<template>
  <div class="app-content">
    <div class="am-search-inpage">
      <div class="am-search-input">
        <input class="am-search-value" v-model.lazy="keyword" type="text" placeholder="请输入职业关键词" @keyup.enter="queryOccupation">
        <div class="am-search-clear" @click="keyword = ''" v-show="keyword !=''">
          <i class="am-icon-clear am-icon clear-tiny"></i>
        </div>
        <div class="am-search-icon" @click="queryOccupation">
          <i class="am-icon search-inpage"></i>
        </div>
      </div>
    </div>
    <div class="am-list">
      <!-- 职业 -->
      <div class="am-list-item dropdown" v-show="occupation_selected_label != '重新选择'">
        <div class="am-list-dropdown-main">
          <div class="am-list-label tar app-color-warn">{{occupation_selected_label}}:</div>
          <div class="am-list-control">
            <select id="occupation" v-model="applicant.occupation_select" @change="occupation_changed">
              <option disabled>请选择</option>
              <option v-for="item in occupations" :value="item.explain+'|'+item.code+'|'+item.if_id">{{item.explain}}</option>
            </select>
          </div>
          <div class="am-list-arrow"><span class="am-icon arrow vertical"></span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '../api'
export default {
  name: 'app-accupation',
  props: ['initOccupations'],
  data() {
    return {
      keyword: '',
      occupation_selected_label: '请选择',
      occupations: null //职业数据
    }
  },
  methods: {
    queryOccupation() {},
    // 清除职业
    clearOccupation() {
      this.warranty.applicant_occupation_code = ''
      this.occupation_selected_label = '请选择'
      this.applicant.occupation_select = ''
      this.occupations = this.initOccupations
    },
    // 职业选择
    occupation_changed() {
      this.warranty.applicant_occupation_code = ''
      this.applicant.occupation = ''
      if (!this.applicant.occupation_select) return
      const selected = this.applicant.occupation_select.split('|')
      this.getOccupation(selected[2], selected[0])
      this.$toast.open(null, 'loading')
    },
    // 获取地址数据
    getOccupation(if_id, explain) {
      const vm = this
      Api.queryOccupation(if_id, data => {
        this.$toast.open(null, null)
        if (data.length < 1) {
          vm.occupation_selected_label = '重新选择'
          vm.occupations = this.initOccupations
          vm.warranty.applicant_occupation_code = if_id
          vm.applicant.occupation = explain
          vm.applicant.occupation_code = if_id
        } else {
          vm.occupation_selected_label = '请继续选择'
          vm.occupations = data
        }
      })
    }
  }
}
</script>
