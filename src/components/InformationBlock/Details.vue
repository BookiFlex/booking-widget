<script setup>
import { defineProps } from 'vue'
import MaterialIcon from '@/components/ui/MaterialIcon.vue'
const props = defineProps({
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
    <MaterialIcon small v-if="!hideIcon">{{ icon }}</MaterialIcon>
    <slot name="default"></slot>
  </div>
</template>

<style lang="scss"></style>
