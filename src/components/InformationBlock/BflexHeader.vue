<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  dense: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <header :class="{ dense: props.dense }">
    <span><slot name="default"></slot></span>
    <span class="information-block__header-additional"><slot name="additional"></slot></span>
  </header>
</template>

<style lang="scss"></style>
