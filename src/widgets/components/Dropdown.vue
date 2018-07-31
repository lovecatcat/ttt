<template>
  <div class="am-list am-list-6lb form ">
    <div class="am-list-body" style="padding: 0">
      <div class="am-list-item dropdown" :class="isup">
        <div class="am-list-dropdown-main" @click="toggle" v-if="label">
          <div class="am-list-control">{{label}}</div>
          <div class="am-list-arrow">
              <span class="am-icon arrow vertical" :class="isup"></span>
          </div>
        </div>
        <div class="am-list-dropdown-main" v-else-if="noToggle">
          <slot name="header"></slot>
        </div>
        <div class="am-list-dropdown-main" @click="toggle" v-else>
          <slot name="header"></slot>
          <div class="am-list-arrow">
            <span class="am-icon arrow vertical" :class="isup"></span>
          </div>
        </div>
        <div class="am-list-dropdown-list">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Dropdown',
  props: {
    label: String,
    up: String,
    noToggle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isup: ''
    }
  },
  created() {
    this.isup = this.up
  },
  methods: {
    toggle() {
      if (this.isup !== 'up') {
        this.isup = 'up'
      } else {
        this.isup = ''
      }
    }
  }
}
</script>
