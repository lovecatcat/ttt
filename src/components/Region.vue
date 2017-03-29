<template>
  <div class="mobileSelect" :class="{'mobileSelect-show':show}">
    <div class="grayLayer"></div>
    <div class="content">
      <div class="btnBar">
        <div class="fixWidth">
          <div class="cancel" @click="close">取消</div>
          <div class="title"></div>
          <div class="ensure" @click="ok">选择</div>
        </div>
      </div>
      <div class="panel">
        <mt-picker :slots="addressSlots" @change="addrChange" :visible-item-count="5"></mt-picker>
      </div>
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
    }
  },
  data() {
    var provinces = Api.obj2json(this.$store.state.init.applicant.province)
    provinces.unshift({
      code: "",
      explain: "请选择省份"
    })
    var level3 = [{
      flex: 1,
      values: provinces,
      className: 'slot1',
      textAlign: 'center'
    }, {
      divider: true,
      content: '-',
      className: 'slot2'
    }, {
      flex: 1,
      className: 'slot3',
      textAlign: 'center'
    }, {
      divider: true,
      content: '-',
      className: 'slot4'
    }, {
      flex: 1,
      className: 'slot5',
      textAlign: 'center'
    }]
    var level2 = [{
      flex: 1,
      values: provinces,
      className: 'slot1',
      textAlign: 'center'
    }, {
      divider: true,
      content: '-',
      className: 'slot2'
    }, {
      flex: 1,
      className: 'slot3',
      textAlign: 'center'
    }]
    var level1 = [{
      flex: 1,
      values: provinces,
      className: 'slot1',
      textAlign: 'center'
    }]
    let Slots
    switch (this.level) {
      case 1:
        Slots = level1
        break;
      case 2:
        Slots = level2
        break;
      case 3:
        Slots = level3
        break;
    }
    return {
      show: false,
      provinces: provinces,
      addressSlots: Slots,
      seleted: []
    }
  },
  computed: {
    cities() {
      return Api.obj2json(this.$store.state.cities)
    },
    districts() {
      return Api.obj2json(this.$store.state.districts)
    }
  },
  methods: {
    addrChange(picker, values) {
      var vm = this
      vm.seleted = []
      if (vm.level > 1) {
        if (typeof vm.cities[values[0].code] == 'object') {
          picker.setSlotValues(1, vm.cities[values[0].code])
        } else if (values[0].code) {
          Api.queryRegion('city', values[0].code, res => {
            if (res.name && res.name.indexOf('Error') > -1) {
              vm.$toast.open('服务器出错了', 'error')
              return
            }
            if (res.length > 0) {
              vm.cities[values[0].code] = res
              picker.setSlotValues(1, res)
            } else {
              vm.cities[values[0].code] = []
              picker.setSlotValues(1, [])
              picker.setSlotValues(2, [])
            }
          })
        } else {
          picker.setSlotValues(1, [])
          picker.setSlotValues(2, [])
        }
      }

      if (vm.level > 2) {
        if (values[1] && values[1].code) {
          if (typeof vm.districts[values[1].code] == 'object') {
            picker.setSlotValues(2, vm.districts[values[1].code])
          } else {
            values[1].code && Api.queryRegion('district', values[1].code, res => {
              if (res.name && res.name.indexOf('Error') > -1) {
                vm.$toast.open('服务器出错了', 'error')
                return
              }
              if (res.length > 0) {
                vm.districts[values[1].code] = res
                picker.setSlotValues(2, res)
              } else {
                vm.districts[values[1].code] = []
                picker.setSlotValues(2, [])
              }
            })
          }
        } else {
          picker.setSlotValues(2, [])
        }
      }
      switch (vm.level) {
        case 1:
          vm.seleted.push(values[0])
          break;
        case 2:
          vm.seleted.push(values[0])
          vm.seleted.push(values[1])
          break;
        case 3:
        default:
          vm.seleted.push(values[0])
          vm.seleted.push(values[1])
          vm.seleted.push(values[2])
          break;
      }
    },
    close() {
      if (!this.seleted) {
        this.$toast.open('请先选择区域', 'warn')
        return false
      }
      this.show = false
    },
    ok() {
      if (!this.seleted) {
        this.$toast.open('请先选择区域', 'warn')
        return
      }
      this.$emit('regionselect', this.seleted)
      this.selected = []
      this.level > 1 && this.$store.commit('setParam', {
        districts: this.districts,
        cities: this.cities
      })
      this.close()
    }
  }
}
</script>
