import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 投保须知
import Notice from '@/components/Notice'
import Confirmation from '@/components/Confirmation'
import Tips from '@/components/Tips'

import Insured from '@/components/Insured' //投保人信息
import Beinsured from '@/components/Beinsured' //被投保人信息
import Beneficiaries from '@/components/Beneficiaries' //身故受益人信息
import Healthinfo from '@/components/Healthinfo' //健康告知
import Billinfo from '@/components/Billinfo' //填写收费信息

import Prospectus from '@/components/Prospectus' //保险计划
import Preview from '@/components/Preview' // 预览
import Success from '@/components/Success' //成功

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
    path: '/confirmation',
    name: 'Confirmation',
    component: Confirmation,
    meta: {
      docTitle: '投保提示书'
    }
  }, {
    path: '/tips',
    name: 'Tips',
    component: Tips,
    meta: {
      docTitle: '投保提示书'
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
      docTitle: '被保险人信息'
    }
  }, {
    path: '/prospectus',
    name: 'Prospectus',
    component: Prospectus,
    meta: {
      docTitle: '选择险种'
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
      docTitle: '填写收费信息'
    }
  }, {
    path: '/preview',
    name: 'Preview',
    component: Preview,
    meta: {
      docTitle: '投保信息确认',
      keepnew: true
    }
  }, {
    path: '/success',
    name: 'Success',
    component: Success,
    meta: {
      docTitle: '提交成功'
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

