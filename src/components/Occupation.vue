<template>
  <div class="am-dialog show app-dialog" v-show="show">
    <div class="am-dialog-wrap">
      <div class="am-dialog-header" slot="header">
        <h3 slot="header">职业</h3>
      </div>
      <div class="am-dialog-body" slot="body">
        <div class="am-list" v-show="commonOccupation.length > 0">
          <div class="am-list-header am-ft-left">常见职业</div>
          <div class="am-content">
            <div class="app-btns am-ft-left">
              <button type="button" class="am-button tiny" v-for="item in commonOccupation" @click="selectOccupation(item)">{{item.explain}}</button>
            </div>
          </div>
        </div>
        <div class="am-list form">
          <div class="am-list-header am-ft-left">选择职业</div>
          <div class="am-list-body">
            <div class="am-list-item">
              <div class="am-list-label">{{selected_label}}</div>
              <div class="am-list-control">
                <select id="occupation" v-model="showSelect" @change="occupationChanged">
                  <option disabled value="0">请选择</option>
                  <option v-for="item in occupations" :value="item.explain+'|'+item.code+'|'+item.if_id">{{item.explain}}</option>
                </select>
              </div>
              <div class="am-list-arrow"><span class="am-icon arrow vertical"></span></div>
            </div>
          </div>
        </div>
        <div class="am-list">
          <div class="am-list-header am-ft-left">搜索职业</div>
        </div>
        <div class="am-search-inpage">
          <div class="am-search-input">
            <input class="am-search-value" v-model.lazy="keyword" type="text" placeholder="或输入职业关键词" @keyup.enter="queryOccupation">
            <div class="am-search-clear" @click="keyword = ''" v-show="keyword !=''">
              <i class="am-icon-clear am-icon clear-tiny"></i>
            </div>
            <div class="am-search-icon" @click="queryOccupation">
              <i class="am-icon search-inpage"></i>
            </div>
          </div>
        </div>
        <div class="am-list" v-if="OccupationResult.length">
          <div class="am-list-header am-ft-left">搜索结果</div>
          <div class="am-list-body">
            <div class="am-list-item" v-for="item,index in OccupationResult" @click="selectOccupation(item)">
              <div class="app-list-title">{{index+1}}. {{item.explain}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="am-dialog-footer" slot="footer">
        <button type="button" class="am-dialog-button" @click="show = false">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '../api'
export default {
  name: 'occupation',
  data() {
    return {
      show: false,
      showSelect: 0,
      level: 0, //职业级数
      keyword: '', // 职业搜索关键词
      occupations: [], //职业数据
      showOccupation: false, //显示职业数据
      OccupationResult: [], //搜索结果
      commonOccupation: [{
          explain: "公务员",
          bs_id: 9764
        }, {
          explain: "行政业务办公人员（内勤）",
          bs_id: 9759
        }, {
          explain: "行政业务办公人员（外勤）",
          bs_id: 9760
        }, {
          explain: "金融一般内勤人员",
          bs_id: 9579
        }, {
          explain: "企业职能部门经理或主管",
          bs_id: 9306
        }, {
          explain: "会计人员",
          bs_id: 9557
        }, {
          explain: "企业经理",
          bs_id: 9305
        }, {
          explain: "工厂企业负责人",
          bs_id: 9307
        }, {
          explain: "农夫",
          bs_id: 10108
        }, {
          explain: "个体摊贩",
          bs_id: 9846
        }, {
          explain: "杂货商",
          bs_id: 10066
        }, {
          explain: "家庭主妇",
          bs_id: 10049
        }, {
          explain: "服饰买卖商",
          bs_id: 10084
        }, {
          explain: "食品商",
          bs_id: 10081
        }, {
          explain: "幼儿教师",
          bs_id: 9593
        }, {
          explain: "中学教师",
          bs_id: 9591
        }, {
          explain: "小学教师",
          bs_id: 9592
        }, {
          explain: "无业人员",
          bs_id: 11336
        }, {
          explain: "退休人员",
          bs_id: 11337
        }] //常见职业
    }
  },
  computed: {
    selected_label() {
      const OccupationLevel = ['一级', '二级', '三级', '四级', '五级', '六级', '七级', '八级']
      return OccupationLevel[this.level]
    },
    initOccupations() {
      return this.$store.state.init ? Api.obj2json(this.$store.state.init.applicant.occupation_code) : {}
    }
  },
  watch: {
    initOccupations(val) {
      this.occupations = val
    }
  },
  methods: {
    // 清除职业
    clearOccupation() {},
    occupationChanged() {
      // var vm = this
      // vm.$set(this.selected, ses, value)
      if (!this.showSelect) return
      const selected = this.showSelect.split('|')
      this.getOccupation(selected[2], selected[0])
      this.$toast.open('', 'loading')
    },
    // 获取职业数据
    getOccupation(bs_id, explain) {
      const vm = this
      if (!bs_id) return
      Api.queryOccupation(bs_id, data => {
        if (data.name && data.name.indexOf('Error') > -1) {
          vm.$toast.open('服务器出错了', 'error')
          return
        }
        this.$toast.close()
        if (data.length < 1) {
          // set Occupation
          vm.$parent.setOccupation({
            explain: explain, //职业
            bs_id: bs_id //职业代码
          })

          // reset
          vm.level = 0
          vm.show = false
          vm.showSelect = 0
          vm.occupations = Api.obj2json(this.$store.state.init.applicant.occupation_code)
        } else {
          vm.level += 1
          vm.showSelect = 0
          vm.occupations = data
        }
      })
    },
    // 选择职业
    selectOccupation(item) {
      this.$parent.setOccupation({
        explain: item.explain, //职业
        bs_id: item.bs_id //职业代码
      })
      this.show = false
    },
    // 搜索职业
    queryOccupation() {
      var vm = this
      if (!vm.keyword) {
        vm.$toast.open('关键词不能为空', 'warn')
        return
      }
      Api.searchOccupation(vm.keyword, response => {
        if (response.data.length > 0 && response.status === true) {
          vm.OccupationResult = response.data
        } else {
          vm.$toast.open('未找到相关职业', 'warn')
        }
      })
    }
  }
}
</script>
