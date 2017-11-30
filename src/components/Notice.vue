<template>
  <div id="notice">
    <div class="am-article app-notice">
      <h3>投保须知</h3>
      <p>1.请您确认已向客户提供本次投保的保险产品条款、产品说明书和投保提示书， 并对条款进行说明，尤其是对保险责任、免除保险人责任的条款、犹豫期、退保等关键信息进行了明确说明。请您务必提醒客户仔细阅读本次所投保险产品条款、产品说明书和投保提示书，并确保客户已完全理解并同意接受电子方式投保。</p>
      <p>2.营销员的代理权限仅限于依据保险条款解释保险产品，说明填写投保单的注意事项，接受及转送有关投保文件和保险合同；营销员无权决定此投保申请或今后的理赔申请是否被接受。</p>
      <p>3.请您确认客户已了解并认可电子投保申请中的有关内容（电子投保单号码为本电子投保确认书右上方的号码，投保时需要将此号码录入在电子投保申请中），并确保本次投保中的投 保人、被保险人及身故受益人信息、投保事项信息均正确无误， 健康、财务及其他告知内容属实，与本次申请有关的问卷、体检报告书及对检医生的各项陈述均确实无误。如有不实告知，公司有权依法解除保险合同，并对合同解除前发生的保险事故不承担保险责任。</p>
      <p>4.请您根据客户的缴费能力，建议其选择合适的缴费期间和缴费金额，以确保本次投保计划符合客户的保险需求，无法持续支付保险费会导致合同效力中止或合同解除，由此会使客户 蒙受经济上的损失。</p>
      <p>5.请您确认客户已同意：通过电子方式投保，保险合同生效之日起十日内为犹豫期，保险合同生效日载明于保险单，客户在犹豫期内解除保险合同的，公司在扣除10元工本费后向客户无息退还所支付保险费。若客户在犹豫期后解除保险合同的，公司将退还保险合同的现金价值。犹豫期后解除合同，客户会遭受一定损失。</p>
      <p>6.请您确认客户已同意：公司查阅、复制有关投保人及被保险人之相关医疗记录、病历及各类检查资料，并授权投、被保人就诊之医疗机构及保存医疗证明的其它机构，向公司及相关 再保险公司提供投、被保人的相关医疗记录。</p>
      <p>7.请您确认客户已同意：公司在对投保人、被保险人个人信息严格保密的基础上，因业务需要对投保人或被保险人之个人资料，有搜集、计算机处理、传递的权利。同时，客户同意公 司通过电话、手机、Email、信件等方式适时为其提供保险信息服务。</p>
      <p>8.请您确认客户已同意：投保申请如无法即时通过审核，或因故未即时支付足额保险费的，客户的本次投保申请将无法即时承保，须等待公司审核完成后收取足额首期保险费并签发保 险单后方可承保生效，具体生效时间以保险单所载日期为准。</p>
      <p>9.请您确认客户已同意：自公司收到客户支付的首期保险费并确认完成电子投保手续之日起，至公司同意承保并签发保险单或发出拒保通知书并退还保险费期间（最长不超过30天），公司仅承担投保人申请投保险种中被保险人的意外身故保险责任（因免责条款约定的情形导致身故的除外），赔付金额以有效投保单所列每一险种中意外身故保险金金额的20%为限，且每 单有效投保单的最高赔付金额不超过人民币十万元。</p>
      <h3>声明与授权:</h3>
      <p>1.本人声明已向客户告知上述投保须知的所有内容，如有隐瞒或告知不实，愿意承担相关责任。</p>
      <p>2.本人声明就公司提出的询问已经向客户确认，填写内容与客户告知内容均符合，客户同意其作为公司签发保险单的依据，并作为保险合同组成部分。如有隐瞒或告知不实，公司可追 究相关连带责任。</p>
      <p>3.本人已征得客户同意，公司可通过电话、手机（包括手机短信）、E-mail适时提供保险信息服务。</p>
      <p>4.本人已向客户确认：客户愿意授权任何医生、医院、诊所、保险公司、公安部门或组织单位及所有熟悉被保险人健康状况之人士，就有关保险事宜均可将被保险人或投保人以往之患病状况、病历等相关资料向公司说明。 公司对投保人和被保人的健康资料、财务资料及其他所提供的资料负有保密义务。</p>
    </div>
    <div class="am-list">
      <div class="am-list-item">
        <div class="app-list-brief">
          请确认客户已认真阅读和理解《投保须知》、 保险产品条款，理解并签署
          <a @click="getTermImg('tips')">《投保提示书》</a>、
          <a @click="getTermImg('confirmation')">《电子投保申请确认书》</a>，同意上述声明与授权，同意本保险合同的生效日为签收日，并以此开始计算犹豫期。
        </div>
      </div>
      <div class="app-agreement">
        <div class="am-checkbox mini argument">
          <input id="agree2" type="checkbox" v-model="agreement">
          <span class="icon-check"></span>
          <label class="am-ft-md" for="agree2">本人(业务员)已向客户确认</label>
        </div>
      </div>
    </div>
    <div class="am-tab am-fixed am-fixed-bottom app-navi">
      <a href="javascript:;" @click="$toast.open('请先确认投保须知','warn')" v-if="!agreement" class="am-tab-item selected">下一步</a>
      <router-link v-else to="/insured" class="am-tab-item selected">下一步</router-link>
    </div>
  </div>
</template>
<script>
import $_GET from '../widgets/Get'
export default {
  name: 'notice',
  data() {
    return {
      agreement: false
    }
  },
  created() {
    this.$store.commit('setParam', {
      ready: true
    })
    if ($_GET['shared']) {
      this.agreement = true
    }
    var applicant = this.$storage.fetch('applicant')
    if (applicant.dd) {
      this.$dialog.open('未完成保单', '是否继续完成最近一笔保单?', () => {
        this.$store.commit('setParam', {
          todo: true
        })
      }, () => {
        this.clearStorage()
      })
    }
  },
  methods: {
    getTermImg(id) {
      let imgs = {
        'tips': 2,
        'confirmation': 2
      }

      let list = []
      let basePath = this.local ? '/static' : '/Theme/index/home/XT_ins'
      for (let i = 0; i < imgs[id]; i++) {
        list.push({
          src: basePath + '/images/' + id + '/' + (i + 1) + '.jpg',
          w: 1024,
          h: 1500
        })
      }
      this.$preview.open(0, list)
    }
  }
}
</script>
