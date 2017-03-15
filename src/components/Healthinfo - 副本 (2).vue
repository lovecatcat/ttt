<template>
  <div id="Healthinfo">
    <div class="app-list-header am-flexbox">
      <div class="am-flexbox-item"><span class="app-iconfont">&#xe631;</span>健康告知</div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">1.您是否有或曾有吸烟习惯且每天大于20支、烟龄大于10年?</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q1" v-model="ass_amswer[1]">
            <label class="am-switch-label" for="q1">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">2.您是否有或曾有饮酒习惯且每天白酒大于3两、酒龄大于10年?</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q2" v-model="ass_amswer[2]">
            <label class="am-switch-label" for="q2">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">3.您近两年内状况：若回答“是”，请详细说明检查原因、检查时间、检查地点、检查结果等。</div>
      </div>
      <div class="am-list-body">
        <div class="am-list-item">
          <div class="app-list-title">A.您是否接受过医师的诊查、治疗、用药、住院或手术建议?</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">B.您是否接受过肿瘤指标的血液学检查、血压、尿液、血液、肝功能、肾功能、心电图、X线、B超、超声心动图、CT、核磁共振、脑电图、肌电图、内窥镜、活体组织检查以及其它检查?</div>
        </div>
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q3" v-model="ass_amswer[3]">
            <label class="am-switch-label" for="q3">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">4.您既往是否有住院诊疗？如“是”请说明住院时间、原因、医院名称及目前状况。</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q4" v-model="ass_amswer[4]">
            <label class="am-switch-label" for="q4">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="am-list-item">
        <div class="app-list-title">5.您是否曾经有下列症状、曾被告知患有下列疾病或接受治疗，如“是”请详细说明。</div>
      </div>
      <div class="am-list-body">
        <div class="am-list-item">
          <div class="app-list-title">A.呼吸系统疾病：如反复咳嗽咯痰、咯血、气喘、呼吸困难、慢性支气管炎、肺气肿、肺心病、呼吸衰竭、间质性肺病、支扩、尘/矽肺、肺结核、肺纤维化、哮喘、胸膜炎、胸腔积液等；</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">B.循环系统疾病：如心慌、胸痛、胸闷、原因不明的晕厥、心脏杂音、心绞痛、心律失常、传导阻滞、心肌梗塞、甲亢性心脏病、高血压、冠心病、心脏瓣膜病、风湿性心脏病、风湿热、主动脉瘤、心肌病、心包炎、室壁瘤、心导管等心血管介入治疗、下肢静脉曲张等；</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">C.神经系统及精神疾病：如反复头痛、神经衰弱、多发性硬化症、阿尔兹海默氏病、癫痫、脊髓疾病、重症肌无力、帕金森氏症、脑出血、脑栓塞、脑瘤、脑动/静脉血管瘤及畸形、短暂性脑缺血、脑炎、脑膜炎、脑瘫、抑郁症、神经官能症、其他精神疾患等；</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">D.消化系统疾病：如原因不明的短期消瘦、肝区疼痛、黄疸、便血、食管静脉曲张、多囊肝、肝血管瘤、肝内胆管炎、肝炎病毒携带、肝炎(请注明类型)、脂肪肝、肝硬化、肝肿大、肝豆状核变性、胆结石、胆囊息肉、家族性肠息肉、胰腺疾病、慢性胃炎、肠炎、肠结核、消化道溃疡或出血、穿孔、溃疡性结肠炎、疝、肠梗阻、痔、肛瘘等；</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">E.泌尿及生殖系统疾病：如尿糖阳性、血尿、蛋白尿、尿路畸形、肾炎、肾小球疾病、肾病综合症、肾功能衰竭、尿毒症、肾移植、肾积水、肾囊肿、泌尿系结石、泌尿系结核、泌尿系感染、生殖器官疾病等；</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">F.内分泌及结缔组织疾病：如关节红肿或酸痛、糖尿病、痛风、高尿酸血症、甲状腺或甲状旁腺疾病、肾上腺疾病、垂体疾病、类风湿性关节炎、风湿病、系统性红斑狼疮、胶原病、白塞氏病、免疫性疾病、肌肉骨骼关节疾病、强直性脊柱炎、椎间盘突出、椎管狭窄、脊柱裂、股骨头坏死、骨关节炎、皮肌炎、肌营养不良症、不明原因的肌肉萎缩、干燥综合症等；</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">G.血液系统疾病：如原因不明的发热、原因不明皮肤和粘膜及齿龈出血、白血病、血友病、紫癜、贫血、血小板减少/增多症、骨髓异常增生综合征、脾脏疾病、淋巴瘤等；</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">H.五官科疾病：如近期原因不明的声音嘶哑、听力下降、耳鸣、复视、美尼尔病、白内障、青光眼、高度近视（800度以上）、视神经或视网膜病变、中耳炎、鼻息肉、鼻中隔偏曲、声带息肉、五官手术史等；</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">I.以上未提及的肿瘤和癌症:包括肉瘤、癌、良性肿瘤、息肉、囊肿、赘生物等；</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">J.先天性疾病、遗传性疾病、脑外伤后综合症、内脏损伤、急/慢性中毒、职业病、性病、皮肤病等；</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">K.艾滋病或艾滋病病毒携带；</div>
        </div>
        <div class="am-list-item">
          <div class="app-list-title">L.是否有以上未提及的其它疾病或症状。</div>
        </div>
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q5" v-model="ass_amswer[5]">
            <label class="am-switch-label" for="q5">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">6.您是否有智力障碍?有无脊柱、胸廓、四肢、五官、手指、足趾畸形或功能障碍?有无言语、咀嚼、视力、听力、嗅觉或中枢神经系统机能障碍?如“是”请说明智障等级，残疾部位、原因、程度。</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q6" v-model="ass_amswer[6]">
            <label class="am-switch-label" for="q6">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">7.您是否曾经或正在使用成瘾药物?如止痛药、麻醉剂、镇静安眠剂、迷幻药、毒品或其它违禁药物。</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q7" v-model="ass_amswer[7]">
            <label class="am-switch-label" for="q7">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">8.女性（12周岁以上）补充告知：</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">A. 您目前是否怀孕满28周?(如“是”请提供完整的围产期检查报告)</div>
        </div>
        <div class="app-list">
          <div class="app-list-title">B. 您是否曾经有或正有阴道不规则流血､白带异常､下腹痛等不适感觉或异常症状?</div>
        </div>
        <div class="app-list">
          <div class="app-list-title">C. 您是否患有或曾经患有子宫肌瘤、子宫内膜异位症、月经不调、异位妊娠、血性溢乳、乳腺炎、乳腺增生、乳腺包块或肿块、不孕症等女性疾病？</div>
        </div>
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q8" v-model="ass_amswer[8]">
            <label class="am-switch-label" for="q8">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">9.儿童（2周岁以下）补充告知：</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">A.出生时体重是否小于2.5公斤､出生孕周是否小于37周?有无难产、窒息?出生后是否入住新生儿病房?</div>
        </div>
        <div class="app-list">
          <div class="app-list-title">B.有无畸形､发育迟缓､惊厥､抽搐､脑瘫､智力障碍､先天性或遗传性疾病等?</div>
        </div>
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q9" v-model="ass_amswer[9]">
            <label class="am-switch-label" for="q9">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">10.您的父母、子女、兄弟姐妹是否有人患有癌症、白血病、血友病、心脑血管疾病、糖尿病、病毒性肝炎或病毒携带、多囊肝肾、肠息肉、其他遗传性疾病等? </div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q10" v-model="ass_amswer[10]">
            <label class="am-switch-label" for="q10">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">11.您在过去的两年内是否曾在其他国家居住或是否在未来一年内有此打算？</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q11" v-model="ass_amswer[11]">
            <label class="am-switch-label" for="q11">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">12.您是否参与跳伞、赛车、赛马、攀岩、潜水、蹦极、高山滑雪、漂流、探险、搏击、特技表演、飞行或其他危险运动或赛事？</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q12" v-model="ass_amswer[12]">
            <label class="am-switch-label" for="q12">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">13.您是否曾发生过交通事故？</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q13" v-model="ass_amswer[13]">
            <label class="am-switch-label" for="q13">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">14.您是否曾被保险公司解除合同或在投保､复效时被延期､拒保､附加条件承保?或曾经申请过理赔?近2年内是否曾在其他保险公司投保以死亡或全残或疾病为给付保险金条件的人身保险,且累计保额超过50万元?</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q14" v-model="ass_amswer[14]">
            <label class="am-switch-label" for="q14">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">15.您是否为当地保监局所规定的特殊人群？包括残疾人以及低保人员等人群。</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q15" v-model="ass_amswer[15]">
            <label class="am-switch-label" for="q15">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="am-list form">
      <div class="app-list">
        <div class="app-list-title">16.若被保险人为未满18周岁的未成年人，请告知是否在其它保险公司已经投保以死亡为给付保险金条件的人身保险？如“是”，请告知已投保的有效身故保险金额总和为_______万。</div>
      </div>
      <div class="am-list-body">
        <div class="app-list">
          <div class="app-list-title">
            <!-- 被保险人 -->
          </div>
          <div class="am-switch">
            <input type="checkbox" class="am-switch-checkbox" id="q16" v-model="ass_amswer[16]">
            <label class="am-switch-label" for="q16">
              <div class="am-switch-inner"></div>
              <div class="am-switch-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="app-mask"></div>
    <div class="app-pupover">
      <div class="am-list form">
        <app-input label="检查原因">
          <input slot="input" type="text" placeholder="必填">
          <div slot="icon" class="am-list-clear"><i class="am-icon-clear am-icon"></i></div>
        </app-input>
        <app-input label="检查时间">
          <input slot="input" type="date" placeholder="必填">
          <div slot="icon" class="am-list-clear"><i class="am-icon-clear am-icon"></i></div>
        </app-input>
        <app-input label="检查地点">
          <input slot="input" type="text" placeholder="必填">
          <div slot="icon" class="am-list-clear"><i class="am-icon-clear am-icon"></i></div>
        </app-input>
        <app-input label="检查结果">
          <input slot="input" type="text" placeholder="必填">
          <div slot="icon" class="am-list-clear"><i class="am-icon-clear am-icon"></i></div>
        </app-input>
        <div class="am-button-group">
          <button type="button" class="am-button tiny">确定</button>
          <button type="button" class="am-button tiny">取消</button>
        </div>
      </div>
      <div class="am-list"></div>
      <div class="am-list"></div>
    </div>
    <div class="am-tab am-fixed am-fixed-bottom app-navi">
      <router-link to="/beneficiaries" class="am-tab-item">上一步</router-link>
      <router-link to="/billinfo" class="am-tab-item selected">下一步</router-link>
    </div>
  </div>
</template>
<script>
// import Api from '../api'
export default {
  name: 'Healthinfo',
  data() {
    var amswer = new Array(16)
    return {
      ass_amswer: amswer
    }
  }
}
</script>
<style lang="scss">
.app {
  &-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(150, 150, 150, .5);
  }
  &-pupover {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 101;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .am-list:not([am-version]) {
      padding-bottom: 0;
      position: relative;
    }
  }
}
</style>
