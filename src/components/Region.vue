<template>
  <div class="am-list-item dropdown" v-show="show">
    <div class="am-list-dropdown-main" v-if="provinces">
      <div class="am-list-label tar app-color-warn">请选择省:</div>
      <div class="am-list-control">
        <select v-model="province" @change="pchanged">
          <option disabled value="0">请选择</option>
          <option v-for="item in provinces" :value="item">{{item.explain}}</option>
        </select>
      </div>
      <div class="am-list-arrow"><span class="am-icon arrow vertical"></span></div>
    </div>
    <div class="am-list-dropdown-main" v-if="cities">
      <div class="am-list-label tar app-color-warn">请选择市/区:</div>
      <div class="am-list-control">
        <select v-model="city" @change="cchanged">
          <option disabled value="0">请选择</option>
          <option v-for="item in cities" :value="item">{{item.explain}}</option>
        </select>
      </div>
      <div class="am-list-arrow"><span class="am-icon arrow vertical"></span></div>
    </div>
    <div class="am-list-dropdown-main" v-if="districts">
      <div class="am-list-label tar app-color-warn">请选择县/区:</div>
      <div class="am-list-control">
        <select v-model="district" @change="dchanged">
          <option disabled value="0">请选择</option>
          <option v-for="item in districts" :value="item">{{item.explain}}</option>
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
  props: {
    level: {
      type: Number,
      default: 3
    },
    provinces: Array
  },
  data() {
    return {
      show: false,
      cities: null,
      districts: null,
      province: null,
      city: {},
      district: {},
      selected: []
    }
  },
  methods: {
    getRegion(mode, code) {
      const vm = this
      Api.queryRegion(mode, code, res => {
        this.local && console.log(res)

        // 判断是否继续
        if (res.length < 1) {
          this.show = false
          return
        }
        if (mode === 'city') {
          vm.cities = res
        } else if (mode === 'district') {
          vm.districts = res
        }
      })
    },
    pchanged() {
      if (!this.province) return false
      this.selected.splice(0, 3, this.province)
      this.changed()
      this.city = 0
      this.level > 1 ? this.getRegion('city', this.province.code) : (this.show = false)
    },
    cchanged() {
      this.selected.splice(1, 2, this.city)
      this.changed()
      this.district = 0
      this.level > 2 ? this.getRegion('district', this.city.code) : (this.show = false)
    },
    dchanged() {
      this.selected.splice(2, 1, this.district)
      this.changed()
      this.show = false
    },
    changed() {
      if (this.selected.length < 1) {
        this.$toast.open('请选择', 'warn')
        return
      }
      this.$emit('regionselect', this.selected)
    },
    clear() {
      this.cities = null
      this.districts = null
      this.province = 0
      this.city = 0
      this.district = 0
      this.selected = []
      this.show = true
    }
  }
}
</script>
