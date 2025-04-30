<script setup>
import { defineProps } from 'vue'

defineProps({
  small: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <small class="material-icons small" :class="{ small: 'material-icons--small' }">
    <slot></slot>
  </small>
</template>

<style lang="scss">
@forward '../../assets/css/material-icons.scss';
</style>
