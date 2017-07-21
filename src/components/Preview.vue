<template>
  <div id="preview">
    <div v-if="!warData" class="app-list-header am-flexbox">
      <div class="am-flexbox-item"><span class="app-iconfont">&#xe631;</span>投保信息预览</div>
    </div>
    <app-dropdown v-if="!warData && applicant" up='up'>
      <template slot="header">
        <div class="am-list-label">投保人资料</div>
        <div class="am-list-content am-ft-right">
          <router-link to="/insured"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </template>
      <app-input label="姓名">
        <input slot="input" v-model="applicant.name" type="text" readonly>
      </app-input>
      <app-select label="证件类型" readonly="true">
        <select v-model="warranty.appl_card_type" v-if="init.applicant" disabled>
          <option v-for="type in init.applicant.document_type" :value="type.if_id">{{type.explain}}</option>
        </select>
      </app-select>
      <app-input label="证件号码">
        <input slot="input" v-model="applicant.document_number" type="text" readonly>
      </app-input>
      <app-input label="证件有效期">
        <div v-if="applicant.document_term === '9999-12-30'" slot="input">长期有效</div>
        <input v-else slot="input" v-model="applicant.document_term" type="text" readonly>
      </app-input>
      <app-select label="性别" readonly="true">
        <select v-model="warranty.appl_sex" v-if="init.applicant" disabled>
          <option v-for="item in init.applicant.sex" :value="item.if_id">{{item.explain}}</option>
        </select>
      </app-select>
      <app-input label="出生日期">
        <input slot="input" v-model="applicant.birthday" type="text" readonly>
      </app-input>
      <app-input label="个人税收居民身份类型" v-if="getAge(applicant.birthday) >= 16">
        <div v-if="warranty.appl_tax_type == item.if_id" v-for="item in init.beneficiary.tax_type" slot="input">{{item.explain}}</div>
      </app-input>
      <app-select label="国籍" readonly="true">
        <select v-model="warranty.appl_nation" v-if="init.applicant" disabled>
          <option v-for="item in init.applicant.nationality" :value="item.if_id">{{item.explain}}</option>
        </select>
      </app-select>
      <app-input label="户籍" v-if="applicant.register_select">
        <input slot="input" readonly :value="applicant.register_select" type="text">
      </app-input>
      <app-input label="通讯地址">
        <input slot="input" readonly :value="applicant.address_select" type="text">
      </app-input>
      <app-input label="详细地址">
        <input slot="input" readonly :value="applicant.address" type="text">
      </app-input>
      <app-input label="邮编">
        <input slot="input" readonly :value="applicant.zipcode" type="text">
      </app-input>
      <app-input label="手机号码" v-show="applicant.tel">
        <input slot="input" readonly :value="applicant.tel" type="text">
      </app-input>
      <app-input label="固定电话" v-show="applicant.visit_tel">
        <input slot="input" readonly :value="applicant.visit_tel" type="text">
      </app-input>
      <app-input label="工作单位" v-show="applicant.work_unit">
        <input slot="input" readonly :value="applicant.work_unit" type="text">
      </app-input>
      <app-input label="年收入">
        <input slot="input" readonly :value="applicant.annual_earnings+'万元'" type="text">
      </app-input>
      <app-select label="收入来源" v-if="warranty.appl_annual_source !== 15457" readonly="true">
        <select v-model="warranty.appl_annual_source" disabled v-if="init.applicant">
          <option v-for="item in init.applicant.annual_source" :value="item.if_id">{{item.explain}}</option>
        </select>
      </app-select>
      <app-input label="收入来源" v-else>
        <input slot="input" readonly :value="applicant.annual_source_other" type="text">
      </app-input>
      <app-input label="身高">
        <input slot="input" readonly :value="applicant.height+'cm'" type="text">
      </app-input>
      <app-input label="体重">
        <input slot="input" readonly :value="applicant.weight+'Kg'" type="text">
      </app-input>
      <app-select label="是被保险人的" readonly="true">
        <select v-model="warranty.is_assured" v-if="init.warranty" disabled>
          <option v-for="item in init.warranty.is_assured" :value="item.if_id">{{item.explain}}</option>
        </select>
      </app-select>
      <app-input label="职业">
        <input slot="input" readonly :value="applicant.occupation" type="text">
      </app-input>
      <app-select label="合同争议处理方式" readonly="true">
        <select v-model="warranty.contract_handle" v-if="init.warranty" disabled>
          <option v-for="item in init.warranty.contract_handle" :value="item.if_id">{{item.explain}}</option>
        </select>
      </app-select>
      <app-input label="仲裁委员会" v-show="warranty.contract_handle === 109">
        <input slot="input" readonly :value="warranty.contract_handle_value" type="text">
      </app-input>
    </app-dropdown>
    <app-dropdown v-if="!warData && assured">
      <template slot="header">
        <div class="am-list-label">被保险人资料</div>
        <div class="am-list-content am-ft-right">
          <router-link to="/beinsured"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </template>
      <app-input label="姓名">
        <input slot="input" v-model="assured.name" type="text" readonly>
      </app-input>
      <app-select label="证件类型" readonly="true">
        <select v-model="warranty.assu_card_type" v-if="init.assured" disabled>
          <option v-for="type in init.assured.document_type" :value="type.if_id">{{type.explain}}</option>
        </select>
      </app-select>
      <app-input label="证件号码">
        <input slot="input" v-model="assured.document_number" type="text" readonly>
      </app-input>
      <app-input label="证件有效期">
        <div v-if="assured.document_term === '9999-12-30'" slot="input">长期有效</div>
        <input v-else slot="input" v-model="assured.document_term" type="text" readonly>
      </app-input>
      <app-select label="性别" readonly="true">
        <select v-model="warranty.assu_sex" v-if="init.assured" disabled>
          <option v-for="item in init.assured.sex" :value="item.if_id">{{item.explain}}</option>
        </select>
      </app-select>
      <app-input label="出生日期">
        <input slot="input" v-model="assured.birthday" type="text" readonly>
      </app-input>
      <app-input label="个人税收居民身份类型" v-if="getAge(assured.birthday) >= 16">
        <div v-if="warranty.assu_tax_type == item.if_id" v-for="item in init.beneficiary.tax_type" slot="input">{{item.explain}}</div>
      </app-input>
      <app-select label="国籍" readonly="true">
        <select v-model="warranty.assu_nation" v-if="init.assured" disabled>
          <option v-for="item in init.assured.nationality" :value="item.if_id">{{item.explain}}</option>
        </select>
      </app-select>
      <app-input label="户籍" v-if="assured.register_select">
        <input slot="input" readonly :value="assured.register_select" type="text">
      </app-input>
      <app-input label="通讯地址">
        <input slot="input" readonly :value="assured.address_select" type="text">
      </app-input>
      <app-input label="详细地址">
        <input slot="input" readonly :value="assured.address" type="text">
      </app-input>
      <app-input label="邮编">
        <input slot="input" readonly :value="assured.zipcode" type="text">
      </app-input>
      <app-input label="手机号码" v-if="assured.tel">
        <input slot="input" readonly :value="assured.tel" type="text">
      </app-input>
      <app-input label="固定电话" v-if="assured.visit_tel">
        <input slot="input" readonly :value="assured.visit_tel" type="text">
      </app-input>
      <app-input label="工作单位" v-show="assured.work_unit">
        <input slot="input" readonly :value="assured.work_unit" type="text">
      </app-input>
      <app-input label="年收入">
        <input slot="input" readonly :value="assured.annual_earnings+'万元'" type="text">
      </app-input>
      <app-select label="收入来源" v-if="warranty.assu_annual_source !== 15457" readonly="true">
        <select v-model="warranty.assu_annual_source" disabled v-if="init.assured">
          <option v-for="item in init.assured.annual_source" :value="item.if_id">{{item.explain}}</option>
        </select>
      </app-select>
      <app-input label="收入来源" v-else>
        <input slot="input" readonly :value="assured.annual_source_other" type="text">
      </app-input>
      <app-input label="身高">
        <input slot="input" readonly :value="assured.height+'cm'" type="text">
      </app-input>
      <app-input label="体重">
        <input slot="input" readonly :value="assured.weight+'Kg'" type="text">
      </app-input>
      <app-input label="职业">
        <input slot="input" readonly :value="assured.occupation" type="text">
      </app-input>
    </app-dropdown>
    <app-dropdown v-if="beneficiary" v-for="beneficiary,index in beneficiaries" v-show="warranty.benefited_type === '1'" :key="index">
      <template slot="header">
        <div class="am-list-label">身故受益人资料</div>
        <div class="am-list-content am-ft-right">
          <router-link to="/beneficiaries"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </template>
      <app-input label="姓名">
        <input slot="input" v-model="beneficiary.name" type="text" readonly>
      </app-input>
      <app-select label="证件类型" readonly="true">
        <select v-model="beneficiary.document_type" v-if="init.applicant" disabled>
          <option v-for="type in init.applicant.document_type" :value="type.if_id">{{type.explain}}</option>
        </select>
      </app-select>
      <app-input label="证件号码">
        <input slot="input" v-model="beneficiary.document_number" type="text" readonly>
      </app-input>
      <app-input label="证件有效期">
        <div v-if="beneficiary.document_term === '9999-12-30'" slot="input">长期有效</div>
        <input v-else slot="input" v-model="beneficiary.document_term" type="text" readonly>
      </app-input>
      <app-select label="性别" readonly="true">
        <select v-model="beneficiary.sex" v-if="init.applicant" disabled>
          <option v-for="item in init.applicant.sex" :value="item.if_id">{{item.explain}}</option>
        </select>
      </app-select>
      <app-input label="出生日期">
        <input slot="input" v-model="beneficiary.birthday" type="text" readonly>
      </app-input>
      <app-select label="是被保险人的" readonly="true">
        <select v-model="beneficiary.relationship" v-if="init.beneficiary" disabled>
          <option v-for="item in init.beneficiary.relationship" :value="item.if_id">{{item.explain}}</option>
        </select>
      </app-select>
      <app-select label="受益顺序" readonly="true">
        <select v-model.number="beneficiary.benefited_level" disabled>
          <option disabled>请选择</option>
          <option :value="item" v-for="item in 10">{{item}}</option>
        </select>
      </app-select>
      <app-input label="受益份额(%)">
        <input slot="input" readonly type="number" v-model.number.lazy="beneficiary.benefited_ratio">
      </app-input>
      <app-input label="个人税收居民身份类型" v-if="getAge(beneficiary.birthday) >= 16">
        <div v-if="beneficiary.tax_type == item.if_id" v-for="item in init.beneficiary.tax_type" slot="input">{{item.explain}}</div>
      </app-input>
      <template v-if="anti_money">
        <app-select label="国籍" readonly="true">
          <select v-model="beneficiary.nationality" v-if="init.applicant">
            <option :disabled="beneficiary.document_type === 57" v-for="type in init.applicant.nationality" :value="type.if_id">{{type.explain}}</option>
          </select>
        </app-select>
        <app-input label="通讯地址">
          <input slot="input" readonly v-model.trim="beneficiary.address_select" type="text" placeholder="请在下方选择和填写">
        </app-input>
        <app-input label="详细地址">
          <input slot="input" readonly v-model.trim="beneficiary.address" type="text" placeholder="请填写详细通讯地址">
        </app-input>
        <app-input label="邮编">
          <input slot="input" readonly v-model.number="beneficiary.zipcode" type="number" placeholder="请填写受益人邮编">
        </app-input>
        <app-input label="手机号码" v-show="beneficiary.tel">
          <input slot="input" readonly v-model.number="beneficiary.tel" type="number">
        </app-input>
        <app-input label="固定电话" v-show="beneficiary.visit_tel">
          <input slot="input" readonly v-model.lazy.trim="beneficiary.visit_tel" type="text">
        </app-input>
        <app-input label="职业">
          <input slot="input" readonly v-model="beneficiary.occupation" type="text">
        </app-input>
      </template>
    </app-dropdown>
    <div class="am-list" v-show="warranty.benefited_type === '0'">
      <div class="am-list-item">
        <div class="am-list-content">
          身故受益人
        </div>
        <div class="am-list-extra">
          法定受益人
          <router-link to="/beneficiaries"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </div>
    </div>
    <app-dropdown v-if="!warData && insurances" v-for="insurance,index in insurances" :key="index">
      <template slot="header">
        <div class="am-list-label">{{'保险计划信息'+(insurances.length>1? (index == 0 ? '(主险)': ('(附加险'+(index>2?index-1:'')+')') ) :'')}}</div>
        <div class="am-list-content am-ft-right">
          <router-link to="/prospectus"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </template>
      <app-select label="险种" readonly="true">
        <select v-model="main_insurance" disabled>
          <option v-if="item.safe_id === '209' || item.safe_id === '210'" v-for="item in safegoods" :value="item">{{item.name}}</option>
        </select>
      </app-select>
      <app-select label="交费期间" readonly="true">
        <select disabled v-model="insurance.pay_year" disabled>
          <option v-for="item in attr" :value="item.sv_id">{{item.pay_year == 1 ? '趸交' : item.pay_year + '年'}}</option>
        </select>
      </app-select>
      <app-select label="保险期间" readonly="true">
        <select disabled v-model="insurance.safe_year" disabled>
          <option v-for="item in attr" :value="item.sv_id">{{item.safe_year==999?'终身':item.safe_year}}</option>
        </select>
      </app-select>
      <app-input label="基本保险金额">
        <input slot="input" readonly :value="insurance.money" type="text">
      </app-input>
      <app-input label="期交保费">
        <input slot="input" readonly :value="insurance.period_money" type="text">
      </app-input>
      <app-select label="保单选项" readonly="true">
        <select v-model="warranty.delivery_way" v-if="init.warranty" disabled>
          <option v-for="item in init.warranty.delivery_way" :value="item.if_id">{{item.explain}}</option>
        </select>
      </app-select>
      <app-input label="邮箱" v-show="warranty.delivery_way === '117'">
        <input slot="input" readonly v-model="applicant.email" type="email">
      </app-input>
      <div class="am-list-item">
        <div class="app-list-title">您是否已参加当地社会基本医疗保险（或公费医疗）？</div>
        <div class="am-switch" v-if="init.assured">
          <input type="checkbox" disabled v-model="warranty.assu_social_security" :true-value="init.assured.social_security[0].if_id" :false-value="init.assured.social_security[1].if_id" class="am-switch-checkbox">
          <label class="am-switch-label">
            <div class="am-switch-inner"></div>
            <div class="am-switch-switch"></div>
          </label>
        </div>
      </div>
    </app-dropdown>
    <app-dropdown v-if="!warData && matters">
      <template slot="header">
        <div class="am-list-label">健康告知</div>
        <div class="am-list-content am-ft-right">
          <router-link to="/healthinfo"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </template>
      <div class="am-list am-list-6lb form" v-for="item,index in matters">
        <div class="am-list-item">
          <div class="app-list-title">{{item.entry}}. {{item.content}}</div>
        </div>
        <template v-if="item.child">
          <div class="am-list-body" v-for="childitem in item.child">
            <div class="am-list-item">
              <div class="app-list-title">{{childitem.entry}}. {{childitem.content}}</div>
            </div>
            <div class="am-list-body">
              <div class="app-list" :class="{'flex-right':!isExempted}">
                <div class="app-list-title" v-if="isExempted">被保险人</div>
                <div class="am-switch">
                  <input type="checkbox" disabled v-model="clientvalue.ass_amswer[childitem.ci_id]" :value="childitem.ci_id" class="am-switch-checkbox" :id="'assmatter'+childitem.ci_id">
                  <label class="am-switch-label" :for="'assmatter'+childitem.ci_id">
                    <div class="am-switch-inner"></div>
                    <div class="am-switch-switch"></div>
                  </label>
                </div>
              </div>
              <div class="app-list" v-if="isExempted">
                <div class="app-list-title">投保人</div>
                <div class="am-switch">
                  <input type="checkbox" disabled v-model="clientvalue.app_amswer[childitem.ci_id]" :value="childitem.ci_id" class="am-switch-checkbox" :id="'appmatter'+childitem.ci_id">
                  <label class="am-switch-label" :for="'appmatter'+childitem.ci_id">
                    <div class="am-switch-inner"></div>
                    <div class="am-switch-switch"></div>
                  </label>
                </div>
              </div>
            </div>
            <div class="am-list-body">
              <div v-if="clientvalue.fields[childitem.ci_id]" class="app-list">
                <div class="app-list-control app-color-error">
                  <div class="app-list-brief" v-if="isExempted">被保险人</div>
                  {{clientvalue.fields[childitem.ci_id]}}
                </div>
              </div>
              <div v-if="clientvalue.fields[childitem.ci_id] && isExempted" class="app-list">
                <div class="app-list-control app-color-error">
                  <div class="app-list-brief">投保人</div>
                  {{clientvalue.fields[childitem.ci_id]}}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="am-list-body">
            <div class="app-list" :class="{'flex-right':!isExempted}">
              <div class="app-list-title" v-if="isExempted">被保险人</div>
              <div class="am-switch">
                <input type="checkbox" disabled v-model="clientvalue.ass_amswer[item.ci_id]" :value="item.ci_id" class="am-switch-checkbox" :id="'assmatter'+item.ci_id">
                <label class="am-switch-label" :for="'assmatter'+item.ci_id">
                  <div class="am-switch-inner"></div>
                  <div class="am-switch-switch"></div>
                </label>
              </div>
            </div>
            <div class="app-list" v-if="isExempted">
              <div class="app-list-title">投保人</div>
              <div class="am-switch">
                <input type="checkbox" disabled v-model="clientvalue.app_amswer[item.ci_id]" :value="item.ci_id" class="am-switch-checkbox" :id="'appmatter'+item.ci_id">
                <label class="am-switch-label" :for="'appmatter'+item.ci_id">
                  <div class="am-switch-inner"></div>
                  <div class="am-switch-switch"></div>
                </label>
              </div>
            </div>
          </div>
          <div class="am-list-body">
            <div v-if="clientvalue.fields[item.ci_id]" class="app-list">
              <div class="app-list-control app-color-error">
                {{clientvalue.fields[item.ci_id]}}
              </div>
            </div>
            <div v-if="clientvalue.fields[item.ci_id] && isExempted" class="app-list">
              <div class="app-list-control app-color-error">
                {{clientvalue.fields[item.ci_id]}}
              </div>
            </div>
          </div>
        </template>
      </div>
    </app-dropdown>
    <app-dropdown v-if="!warData && warranty">
      <template slot="header">
        <div class="am-list-label">收费信息</div>
        <div class="am-list-content am-ft-right">
          <router-link to="/billinfo"><span class="app-iconfont">&#xe649;</span>修改&nbsp;&nbsp;</router-link>
        </div>
      </template>
      <div class="am-list am-list-6lb form">
        <div class="am-list-body">
          <app-input label="首期、续期交费方式">
            <input slot="input" readonly value="银行转账">
          </app-input>
          <app-input label="户名">
            <input slot="input" readonly v-model.trim="applicant.name" type="text">
          </app-input>
          <app-input label="银行账号">
            <input slot="input" readonly v-model="warranty.bank_account" type="text">
          </app-input>
          <app-select label="开户行" readonly="true">
            <select v-model="warranty.bank_name" v-if="init.transferstate" disabled>
              <option v-for="item in init.transferstate.bank_name" :value="item.if_id">{{item.explain}}</option>
            </select>
          </app-select>
          <app-select label="账户类别" readonly="true">
            <select v-model="warranty.bank_card" v-if="init.transferstate" disabled>
              <option v-for="item in init.transferstate.bank_card" :value="item.if_id">{{item.explain}}</option>
            </select>
          </app-select>
          <app-input label="开户行所在地">
            <input slot="input" readonly v-model.trim="warranty.bank_address" type="text">
          </app-input>
        </div>
      </div>
    </app-dropdown>
    <div v-if="!warData" class="app-list-header am-flexbox">
      <div class="am-flexbox-item"><span class="app-iconfont">&#xe631;</span>信息确认</div>
    </div>
    <div v-if="!warData" class="app-article">
      投保人、被保险人已仔细阅知，理解投保提示、产品说明书（仅限于分红、万能、投资连结类保险）、及保险条款尤其是责任免除、解除合同等规定，并同意遵守。投保人、被保险人确认在电子投保中的告知均为如实告知，与之有关的各份问卷及文件、对体检医生的各项申明与陈述均属真实，并知晓上述信息将作为贵公司承保的依据。如有不如实告知，贵公司有权依法解除合同，并依法决定是否对合同解除前发生的保险事故承担保险责任。
    </div>
    <div v-if="!warData" class="am-list">
      <div class="am-checkbox mini argument">
        <input id="agree" type="checkbox" v-model="confirm">
        <span class="icon-check" aria-hidden="true"></span>
        <label class="am-ft-md" for="agree">确认信息无误后，方可进行到下一步。</label>
      </div>
    </div>
    <div v-if="warData" class="app-list-header am-flexbox">
      <div class="am-flexbox-item"><span class="app-iconfont">&#xe631;</span>投保信息确认</div>
    </div>
    <div v-if="warData" class="am-content am-ft-right am-ft-red">合计保费：{{countFee(warData)}}元</div>
    <div class="am-tab am-fixed am-fixed-bottom app-navi">
      <router-link to="/billinfo" class="am-tab-item">上一步</router-link>
      <a @click="push()" class="am-tab-item selected">{{warData ? '确认投保' :'提交投保'}}</a>
    </div>
  </div>
</template>
<script>
const qs = require('qs')
import Api from '../api'
import {
  mapState
} from 'vuex'

export default {
  name: 'preview',
  data() {
    return {
      warData: null, //保单信息
      // main_insurance: null, //主险
      // attr: null, //保险属性
      isExempted: false, // 是否豁免投保人
      confirm: false, //确认信息
      uploading: false //正在提交
    }
  },
  computed: {
    ...mapState([
      'init',
      'matters',
      'safegoods',
      'main_insurance'
    ]),
    applicant() {
      return Api.obj2json(this.$store.state.applicant)
    },
    assured() {
      return Api.obj2json(this.$store.state.assured)
    },
    warranty() {
      return Api.obj2json(this.$store.state.warranty)
    },
    beneficiaries() {
      return this.$store.state.beneficiaries
    },
    clientvalue() {
      return Api.obj2json(this.$store.state.clientvalue)
    },
    insurances() {
      return this.$store.state.insurances
    },
    anti_money() {
      return this.$store.state.anti_money
    },
    attr() {
      return this.$store.state.main_insurance.attr
    }
  },
  beforeRouteLeave(to, from, next) {
    this.warData = null
    next()
  },
  activated() {
    this.$forceUpdate()
  },
  methods: {
    countFee(obj) {
      var c = 0
      for (var i in obj.data) {
        c += parseInt(obj.data[i])
      }
      return c
    },
    push() {
      const vm = this
      if (!vm.confirm) {
        vm.$toast.open('请先确认信息无误', 'warn')
        return false
      }
      if (vm.uploading) {
        return false
      }
      vm.uploading = true
      setTimeout(() => {
        vm.uploading = false
      }, 1500)
      vm.$toast.open('正在提交', 'loading')
      let pushData = {}
      let filter = ['register_select', 'address_select', 'contains', 'getArrayIndex', 'bank_label', 'ChCity', 'ChDistrict', 'ChPro', 'oid', 'pid', 'bank_address']
      for (var j in vm.applicant) {
        var index = 'applicant_' + j
        if (filter.indexOf(j) > -1) {
          continue
        }
        pushData[index] = vm.applicant[j]
      }
      for (var k in vm.assured) {
        var o = 'assured_' + k
        if (filter.indexOf(k) > -1) {
          continue
        }
        pushData[o] = vm.assured[k]
      }
      for (var m in vm.warranty) {
        if (filter.indexOf(m) > -1) continue
        var p = 'warranty_' + m
        pushData[p] = vm.warranty[m]
      }
      pushData['warranty_admin_id'] = vm.$store.state.admin_id
      pushData['warranty_sc_id'] = 19
      pushData['warranty_card_holder'] = vm.applicant.name
        // pushData['warranty_add_time'] = (Date.parse(new Date())).toString().substr(0, 10)
      pushData['warranty_is_save'] = 1
      pushData['warranty_source'] = 2

      pushData['clientvalue_ci_id'] = []
      pushData['clientvalue_app_amswer'] = []
      pushData['clientvalue_ass_amswer'] = []
      pushData['clientvalue_app_fields'] = []
      pushData['clientvalue_fields'] = []
      pushData['clientvalue_war_id'] = []
      var warId = ''
      vm.matters.forEach(i => {
        var index = i.ci_id
        pushData['clientvalue_ci_id'].push(i.ci_id)
        pushData['clientvalue_app_amswer'].push(vm.clientvalue.app_amswer[index] ? 1 : 0)
        pushData['clientvalue_ass_amswer'].push(vm.clientvalue.ass_amswer[index] ? 1 : 0)

        pushData['clientvalue_app_fields'].push(vm.clientvalue.app_fields[index] || '')
        pushData['clientvalue_fields'].push(vm.clientvalue.fields[index] || '')
        pushData['clientvalue_war_id'].push(warId)
        if (i.child) {
          i.child.forEach(child => {
            var index = child.ci_id
              // index = i.entry + child.entry
            pushData['clientvalue_ci_id'].push(child.ci_id)
            pushData['clientvalue_app_amswer'].push(vm.clientvalue.app_amswer[index] ? 1 : 0)
            pushData['clientvalue_ass_amswer'].push(vm.clientvalue.ass_amswer[index] ? 1 : 0)
            pushData['clientvalue_app_fields'].push(vm.clientvalue.app_fields[index] || '')
            pushData['clientvalue_fields'].push(vm.clientvalue.fields[index] || '')
            pushData['clientvalue_war_id'].push(warId)
          })
        }
      })
      if (vm.warranty.benefited_type === '1') {
        pushData['beneficiary_war_id'] = []
        pushData['beneficiary_name'] = []
        pushData['beneficiary_sex'] = []
        pushData['beneficiary_birthday'] = []
        pushData['beneficiary_benefited_ratio'] = []
        pushData['beneficiary_benefited_level'] = []
        pushData['beneficiary_document_type'] = []
        pushData['beneficiary_document_type_val'] = []
        pushData['beneficiary_document_number'] = []
        pushData['beneficiary_document_term'] = []
        pushData['beneficiary_relationship'] = []
        pushData['beneficiary_tax_type'] = []
        if (vm.anti_money) {
          pushData['beneficiary_address'] = []
          pushData['beneficiary_province'] = []
          pushData['beneficiary_city'] = []
          pushData['beneficiary_district'] = []
          pushData['beneficiary_zipcode'] = []
          pushData['beneficiary_visit_tel'] = []
          pushData['beneficiary_tel'] = []
          pushData['beneficiary_occupation'] = []
          pushData['beneficiary_occupation_code'] = []
          pushData['beneficiary_nationality'] = []
        }
        vm.beneficiaries.forEach(function(beneficiary) {
          pushData['beneficiary_war_id'].push(warId)
          pushData['beneficiary_name'].push(beneficiary.name)
          pushData['beneficiary_sex'].push(beneficiary.sex)
          pushData['beneficiary_birthday'].push(beneficiary.birthday)
          pushData['beneficiary_benefited_ratio'].push(beneficiary.benefited_ratio)
          pushData['beneficiary_benefited_level'].push(beneficiary.benefited_level)
          pushData['beneficiary_document_type'].push(beneficiary.document_type)
          pushData['beneficiary_document_type_val'].push(beneficiary.document_type_val)
          pushData['beneficiary_document_number'].push(beneficiary.document_number)
          pushData['beneficiary_document_term'].push(beneficiary.document_term)
          pushData['beneficiary_relationship'].push(beneficiary.relationship)
          pushData['beneficiary_tax_type'].push(beneficiary.tax_type)
          if (vm.anti_money) {
            pushData['beneficiary_nationality'].push(beneficiary.nationality)
            pushData['beneficiary_address'].push(beneficiary.address)
            pushData['beneficiary_province'].push(beneficiary.province)
            pushData['beneficiary_city'].push(beneficiary.city)
            pushData['beneficiary_district'].push(beneficiary.district)
            pushData['beneficiary_zipcode'].push(beneficiary.zipcode)
            pushData['beneficiary_visit_tel'].push(beneficiary.visit_tel)
            pushData['beneficiary_tel'].push(beneficiary.tel)
            pushData['beneficiary_occupation'].push(beneficiary.occupation)
            pushData['beneficiary_occupation_code'].push(beneficiary.occupation_code)
          }
        })
      }
      pushData['insurance_war_id'] = []
      pushData['insurance_money'] = []
      pushData['insurance_pay_year'] = []
      pushData['insurance_safe_id'] = []
      pushData['insurance_safe_year'] = []
      pushData['insurance_period_money'] = []

      vm.insurances.forEach(function(insurance) {
        pushData['insurance_war_id'].push(warId)
        pushData['insurance_money'].push(insurance.money)
        pushData['insurance_pay_year'].push(insurance.pay_year)
        pushData['insurance_safe_id'].push(insurance.safe_id)
        pushData['insurance_safe_year'].push(insurance.safe_year)
        pushData['insurance_period_money'].push(insurance.period_money)
      })
      this.local && console.log(pushData)
      vm.$toast.open('正在投保中', 'loading')

      // if (pushData) return false
      Api.pushWarranty(qs.stringify(pushData), res => {
        if (res.name && res.name.indexOf('Error') > -1) {
          vm.$toast.open('服务器开小差了', 'error')
          return
        }
        if (res.status === '0') {
          vm.$toast.open('提交失败：' + res.message, '', 5000)
          return false
        } else {
          vm.$toast.open(res.status === 1 ? '投保成功' : res.message, 'success')
          vm.$store.dispatch('setParam', {
            status: res.status,
            tid: res.data
          })
          this.clearStorage()
          setTimeout(function() {
            vm.$router.push('/success')
          }, 2000)
        }
      })
    }
  }
}
</script>
