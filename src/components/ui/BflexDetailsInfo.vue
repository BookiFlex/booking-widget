<script setup>
import { defineProps } from 'vue'
import BflexIcon from '@/components/ui/BflexIcon.vue'
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
    <div class="details-info__icon"><BflexIcon v-if="!hideIcon" :name="icon"></BflexIcon></div>
    <slot name="default"></slot>
  </div>
</template>

<style lang="scss"></style>
