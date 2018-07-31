<template>
  <div class="am-list-item">
    <div :class="{'am-list-label': !autoWidth,'app-list-title': autoWidth}">{{label}}</div>
    <div class="am-list-control">
      <slot name="input"></slot>
      <slot name="button"></slot>
      <slot name="icon"></slot>

    </div>
    <!--<slot name="button"></slot>-->
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
