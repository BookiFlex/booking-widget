<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  icon: {
    type: String,
    default: 'info'
  },
  hideIcon: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="information-block__info__details">
    <span v-if="!hideIcon" class="material-icons small">{{ icon }}</span>
    <slot name="default"></slot>
  </div>
</template>

<style lang="scss">
</style>
