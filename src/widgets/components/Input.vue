<template>
  <div class="am-list-item">
    <div :class="{'am-list-label': !autoWidth,'app-list-title': autoWidth}">{{label}}</div>
    <div class="am-list-control">
      <slot name="input"></slot>
    </div>
    <slot name="icon"></slot>
    <slot name="button"></slot>
  </div>
</template>
<script>
  export default {
    name: 'Input',
    props: {
      label: String,
      autoWidth: Boolean
    }
  }
</script>
