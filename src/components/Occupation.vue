<template>
  <div class="show app-dialog" v-show="OccupationShow">
    <div class="app-dialog-bg"></div>
    <div class="am-dialog-wrap">
      <div class="am-dialog-header" slot="header">
       选择职业
      </div>
      <section class="am-dialog-body" slot="body">
        <div class="am-list am-list-6lb form" v-show="commonOccupation.length > 0">
          <div class="app-list-header">常见职业</div>
          <div class="am-list-body" style="padding-left: .1rem">
            <div class="app-btns am-ft-left">
              <button type="button" class="am-button tiny" :class="{'tiny-blue':commonOccupation_name === item.text}" v-for="item in commonOccupation" @click="selectOccupation(item)">{{item.text}}</button>
            </div>
          </div>
        </div>

        <div class="am-list am-list-6lb form">
          <div class="app-list-header">选择职业</div>
          <div class="am-list-body">
            <div class="am-list-item ">
              <div class="am-list-label">职业</div>
              <div class="am-list-control">
                <input type="text" placeholder="请选择" readonly v-model="showSelect_name" @click="toShow(resSelect)" >
                <div class="am-list-clear" style=""><i class="iconfont icon-xiajiantou"></i></div>
              </div>
            </div>
          </div>
        </div>

        <div class="am-list am-list-6lb form" style="padding-bottom: .1rem">
          <div class="app-list-header">搜索职业</div>
          <div class="am-list-body" aria-labelledby="demo-cb-header-1">

            <div class="am-list-item ">
              <div class="am-list-label">搜索职业</div>
              <div class="am-list-control" style="width: 70%">
                <input v-focus v-model.lazy="keyword" type="text" placeholder="请输入职业关键词">
                <div class="am-list-clear" @click="keyword = ''" v-show="keyword !==''"><i class="iconfont icon-chahao"></i></div>
              </div>
              <div  class="am-list-change orange" @click="searchOccupation">
                搜索
              </div>
            </div>
            <div class="app-btns am-ft-left" style="padding-left: .1rem" v-if="OccupationResult.length">
              <button type="button" class="am-button tiny" :class="{'tiny-blue':OccupationResult_name === item.name}" v-for="item in OccupationResult"
              @click="searchSure(item)">{{item.name}}</button>
            </div>
          </div>
        </div>

      </section>
      <div class="am-button-group" slot="footer">
        <!--<button type="button" class="am-button white" @click="OccupationShow = false">取消</button>-->
        <button type="button" class="am-button blue" @click="OccupationShow = false">确定</button>
      </div>
    </div>
    <!--vue-pickers-->
    <vue-pickers :show="show" :columns="columns" :selectData="pickData" @cancel="close"
                 @confirm="confirmFn"></vue-pickers>
  </div>
</template>
<script>
import Api from '../api'
import vuePickers from 'vue-pickers'
export default {
  name: 'occupation',
  components: {
    vuePickers
  },
  data() {
    return {
      isCopy: '',
      res: null,
      show: false,
      columns: 1,
      pickData: {
        data1: []
      },
      resSelect: 1,
      OccupationShow: false,
      showSelect: '',
      showSelect_name: '',
      level: 1, //职业级数
      keyword: '', // 职业搜索关键词
      occupations: [], //职业数据
      showOccupation: false, //显示职业数据
      OccupationResult: [], //搜索结果
      OccupationResult_name: '', //搜索结果
      commonOccupation_name: '',
      commonOccupation: [{
        text: '公务员',
        value: ['LAE0B8L', 'LAE0B99', 'LAE0BF2', 'LAE0BZT']
      }, {
        text: '行政业务办公人员（内勤）',
        value: ['LAE0B8L', 'LAE0B99', 'LAE0BF1', 'LAE0BZO']
      }, {
        text: '农夫',
        value: ['LAE0B8N', 'LAE0B9L', 'LAE0BGM', 'LAE0C9D']
      }, {
        text: '行政业务办公人员（外勤）',
        value: ['LAE0B8L', 'LAE0B99', 'LAE0BF1', 'LAE0BZP']
      },{
        text: '营业员',
        value: ['LAE0B8M', 'LAE0B9D', 'LAE0BFA', 'LAE0C1H']
      },{
        text: '内勤人员',
        value: ['LAE0B8K', 'LAE0B97', 'LAE0BEZ', 'LAE0BZJ']
      }, {
        text: '金融一般内勤人员',
        value: ['LAE0B8M', 'LAE0B9D', 'LAE0BFA', 'LAE0C1H']
      }, {
        text: '会计人员',
        value: ['LAE0B8K', 'LAE0B91', 'LAE0BD0', 'LAE0BU2']
      }, {
        text: '病房护士',
        value: ['LAE0B8K', 'LAE0B90', 'LAE0BCW', 'LAE0BTR']
      }, {
        text: '旅游及公共游览场所服务人员',
        value: ['LAE0B8M', 'LAE0B8M', 'LAE0B9G', 'LAE0BFQ']
      }, {
        text: '工厂企业负责人',
        value: ['LAE0B8J', 'LAE0B8V', 'LAE0BAZ', 'LAE0BN4']
      }, {
        text: '中介代理人',
        value: ['LAE0B8M', 'LAE0B9J', 'LAE0BG4', 'LAE0C6K']
      }, {
        text: '小学教师',
        value: ['LAE0B8K', 'LAE0B94', 'LAE0BDH', 'LAE0BV1']
      },{
        text: '幼儿教师',
        value: ['LAE0B8K', 'LAE0B94', 'LAE0BDI', 'LAE0BV2']
      }, {
        text: '银行储蓄员',
        value: ['LAE0B8K', 'LAE0B92', 'LAE0BD3', 'LAE0BUD']
      }, {
        text: '出版物送货员',
        value: ['LAE0B8M', 'LAE0B9K', 'LAE0BGL', 'LAE0C95']
      }, {
        text: '药物制剂工',
        value: ['LAE0B8O', 'LAE0BA4', 'LAE0BKI', 'LAE0CWF']
      }, {
        text: '无业人员',
        value: ['LAE0B8Q', 'LAE0BAJ', 'LAE0BMF', 'LAE0D7H']
      }, {
        text: '退休人员',
        value: ['LAE0B8Q', 'LAE0BAJ', 'LAE0BMF', 'LAE0D7I']
      }] //常见职业
    }
  },
  computed: {
    init() {
      return this.$store.state.init || {}
    }
  },
  methods: {
    close() {
      this.show = false
      this.pickData.data1 = this.init.occupation
      this.occupations = []
    },
    confirmFn(val) {
      if (this.resSelect === 1 || this.resSelect === 2 || this.resSelect === 3) {
        this.resSelect++
        this.showSelect = val.select1.value
        this.showSelect_name = val.select1.text
        this.occupations.push(val.select1.value)
        // 获取职业数据
        Api.queryOccupation(this.showSelect, res => {
          let arr = []
          if (!res) {
            return false
          }
          res.forEach(function (item) {
            arr.push({
              text: item.name ,
              value: item.id
            })
          })
          this.pickData.data1 = arr
          this.$forceUpdate()
        })
      } else if (this.resSelect === 4) {
        this.showSelect = val.select1.value
        this.showSelect_name = val.select1.text
        this.occupations.push(val.select1.value)
        console.log(this.occupations)
        console.log(val.select1.text)
        this.show = false
        this.pickData.data1 = this.init.occupation
        this.resSelect = 1
        this.$parent.setOccupation({
          text: this.showSelect_name, //职业
          value: this.occupations//职业代码
        })
      }
    },
    toShow(type) {
      document.activeElement.blur()
      if (type === 1) {
        // this.resSelect = 's1'
        this.pickData.data1 = this.init.occupation
        this.occupations = []
      }
      this.show = true
    },
    // 选择职业
    selectOccupation(item) {
      this.commonOccupation_name = item.text
      this.showSelect_name = item.text
      this.$parent.setOccupation({
        text: item.text, //职业
        value: item.value //职业代码
      })
      // this.show = false
    },
    // 搜索职业
    searchOccupation() {
      var vm = this
      if (!vm.keyword) {
        vm.$toast.open('关键词不能为空', 'warn')
        return
      }
      Api.searchOccupation(vm.keyword, response => {
        if (response.code) {
          vm.OccupationResult = response.data
        } else {
          vm.$toast.open('未找到相关职业', 'warn')
        }
      })
    },
    searchSure(item) {
      // let vm = this
      this.OccupationResult_name = item.name
      this.showSelect_name = item.name
      Api.getJobPid(item.id, response => {
        console.log(response)
        let data = [response[1], response[2], response[3], response[4]]
        this.$parent.setOccupation({
          text: item.name, //职业
          value: data //职业代码
        })
      })
    }
  }
}
</script>
