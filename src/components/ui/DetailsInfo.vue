<script setup>
import { defineProps } from 'vue'
import Icon from '@/components/ui/Icon.vue'
defineProps({
  icon: {
    type: String,
    default: 'info',
  },
  hideIcon: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="details-info">
    <div class="details-info__icon"><Icon v-if="!hideIcon" :name="icon"></Icon></div>
    <slot name="default"></slot>
  </div>
</template>

<style lang="scss"></style>
