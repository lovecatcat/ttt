<template>
  <div class="am-list-item am-input-autoclear">
    <div class="am-list-label">{{label}}</div>
    <div class="am-list-control">
      <slot></slot>
      <slot name="icon"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Select',
    props: {
      label: String,
      readonly: [Boolean, String]
    }
  }
</script>
