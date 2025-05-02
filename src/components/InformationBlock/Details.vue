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
  <div class="information-block__info__details">
    <Icon v-if="!hideIcon" :name="icon" small></Icon>
    <slot name="default"></slot>
  </div>
</template>

<style lang="scss"></style>
