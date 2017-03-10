<template>
  <div class="am-list-item dropdown" v-show="label[0] != '重新选择'">
    <div class="am-list-dropdown-main">
      <div class="am-list-label tar app-color-warn">{{label[0]}}:</div>
      <div class="am-list-control">
        <select v-if="provinces" v-model="province.selected" v-show="label[0] == '请选择省'" @change="province_changed">
          <option disabled>请选择</option>
          <option v-if="item.code.substr(2,4) == '0000'" v-for="item in provinces" :value="item.explain+'|'+item.code+'|'+item.if_id">{{item.explain}}</option>
        </select>
        <select v-model="city.selected" v-show="label[0] == '请选择市'" @change="city_changed">
          <option disabled>请选择</option>
          <option v-if="item.code.substr(4,2) == '00'" v-for="item in citys" :value="item.explain+'|'+item.code+'|'+item.if_id">{{item.explain}}</option>
        </select>
        <select v-model="district.selected" v-show="label[0] == '请选择县/区'" @change="district_changed">
          <option disabled>请选择</option>
          <option v-for="item in districts" :value="item.explain+'|'+item.code+'|'+item.if_id">{{item.explain}}</option>
        </select>
      </div>
      <div class="am-list-arrow"><span class="am-icon arrow vertical"></span></div>
    </div>
  </div>
</template>
<script>
import Api from '../api'

export default {
  name: 'region',
  props: ['provinces', 'label', 'level'],
  data() {
    return {
      province: {
        selected: '',
        field: '',
        code: '',
        if_id: ''
      },
      city: {
        selected: '',
        field: '',
        code: '',
        if_id: ''
      },
      district: {
        selected: '',
        field: '',
        code: '',
        if_id: ''
      },
      citys: [],
      districts: [],
      selects: []
    }
  },
  computed: {
    goon() {
      return this.level || '3'
    }
  },
  watch: {
    selects: {
      handler(val) {
        console.info('the selected is', val)
        this.$emit('regionselect', this.selects, this.province, this.city, this.district)
      },
      deep: true
    },
    label: {
      handler(val) {
        console.info(val[0], 'label updated at', new Date())
        this.resetSelect()
      }
    }
  },
  methods: {
    resetSelect() {
      console.info('selected reseted at', new Date())
        // 重置省份
      this.province = {
        selected: '',
        field: '',
        code: '',
        if_id: ''
      }
      this.city = {
        selected: '',
        field: '',
        code: '',
        if_id: ''
      }
      this.district = {
        selected: '',
        field: '',
        code: '',
        if_id: ''
      }
      this.selected = ''
    },
    province_changed() {
      if (!this.province.selected) return
      const selected = this.province.selected.split('|')
      this.province.field = selected[0]
      this.province.code = selected[1]
      this.province.if_id = selected[2]
      this.city.field = ''
      this.district.field = ''

      this.selects = selected[0]
      if (this.goon < 3 && ['110000', '120000', '310000', '500000', '810000', '820000'].indexOf(selected[1]) >= 0) {
        this.label[0] = '重新选择'
        return
      }
      /*      if (this.goon == 2 && ['110000', '120000', '310000', '500000'].indexOf(selected[1]) >= 0) {
              this.label[0] = '重新选择'
              return
            }*/
      if (this.goon > 1 && selected[1].substr(2, 4) == '0000') {
        this.getRegion('city', this.province.code);
      } else {
        this.label[0] = '重新选择'
      }
    },
    city_changed() {
      if (!this.city.selected) return
      const selected = this.city.selected.split('|');
      this.city.field = selected[0]
      this.city.code = selected[1]
      this.city.if_id = selected[2]
      this.district.field = ''

      this.selects = this.province.field + " " + selected[0]
      if (this.goon > 2) {
        this.getRegion('district', this.city.code);
      } else {
        this.label[0] = '重新选择'
      }
    },
    district_changed() {
      if (!this.district.selected) return
      const selected = this.district.selected.split('|');
      this.district.field = selected[0]
      this.district.code = selected[1]
      this.district.if_id = selected[2]

      this.label[0] = '重新选择'
      if (this.city.field == selected[0]) {
        this.selects = this.province.field + " " + this.city.field
        return
      }
      this.selects = this.province.field + " " + this.city.field + " " + selected[0]
    },
    getRegion(mode, code) {
      const vm = this
      Api.queryRegion(mode, code, res => {
        if (res.length < 1) {
          vm.label[0] = '重新选择'
          vm.$forceUpdate() // 不知为何需要强制更新
          return
        }
        if (mode == 'city') {
          vm.citys = res
          vm.label[0] = '请选择市'
        } else if (mode == 'district') {
          vm.districts = res
          vm.label[0] = '请选择县/区'
        }
      })
    }
  }
}
</script>
