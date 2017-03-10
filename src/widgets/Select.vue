<template>
  <div class="am-list-item dropdown">
    <div class="am-list-dropdown-main">
      <div class="am-list-label">{{label}}</div>
      <div class="am-list-control">
        <slot></slot>
      </div>
      <div v-if="!readonly" class="am-list-arrow"><span class="am-icon arrow vertical"></span></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Select',
  props: ['label', 'readonly']
}
</script>
