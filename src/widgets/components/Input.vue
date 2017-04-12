<template>
  <div class="am-list-item">
    <div class="am-list-label">{{label}}</div>
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
  props: ['label']
}
</script>
