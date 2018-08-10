import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 投保须知
import Notice from '@/components/Notice'

import Insured from '@/components/Insured' //投保人信息
import Beinsured from '@/components/Beinsured' //被投保人信息
import Beneficiaries from '@/components/Beneficiaries' //身故受益人信息
import Healthinfo from '@/components/Healthinfo' //健康告知
// import HealthinfoV1 from '@/components/HealthinfoV1' //健康告知版本一
import Billinfo from '@/components/Billinfo' //填写收费信息
import xtPay from '@/components/xtPay' //重新支付

import Prospectus from '@/components/Prospectus' //保险计划
import Preview from '@/components/Preview' // 预览
import Success from '@/components/Success' //支付成功
import PayFail from '@/components/PayFail' //支付失败

import NotFound from '@/components/NotFound' //未找到
// import Api from '../api'

const router = new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Notice,
    meta: {
      docTitle: '投保须知'
    }
  }, {
    path: '/insured',
    name: 'Insured',
    component: Insured,
    meta: {
      docTitle: '投保人信息'
    }
  }, {
    path: '/beinsured',
    name: 'Beinsured',
    component: Beinsured,
    meta: {
      docTitle: '被保人信息'
    }
  }, {
    path: '/prospectus',
    name: 'Prospectus',
    component: Prospectus,
    meta: {
      docTitle: '险种信息'
    }
  }, {
    path: '/beneficiaries',
    name: 'Beneficiaries',
    component: Beneficiaries,
    meta: {
      docTitle: '身故受益人信息'
    }
  }, {
    path: '/healthinfo',
    name: 'Healthinfo',
    component: Healthinfo,
    meta: {
      docTitle: '健康告知'
    }
  }, {
    path: '/billinfo',
    name: 'Billinfo',
    component: Billinfo,
    meta: {
      docTitle: '交费信息'
    }
  }, {
    path: '/xtPay',
    name: 'xtPay',
    component: xtPay,
    meta: {
      docTitle: '信泰支付'
    }
  }, {
    path: '/preview',
    name: 'Preview',
    component: Preview,
    meta: {
      docTitle: '信息确认'
    }
  }, {
    path: '/success',
    name: 'Success',
    component: Success,
    meta: {
      docTitle: '提交成功'
    }
  },{
    path: '/payfail',
    name: 'PayFail',
    component: PayFail,
    meta: {
      docTitle: '支付失败'
    }
  }, {
    path: '*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      docTitle: '404 页面不存在'
    }
  }]
})

// 更新document.title
router.beforeEach((to, from, next) => {
  if (!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    document.title = to.meta.docTitle
  }
  next()
})

export default router

