<script setup>
import { defineProps } from 'vue'
import { Tooltip } from 'floating-vue'

defineProps({
  trigger: {
    type: [String, Array],
    default: () => ['click', 'touch'],
  },
  distance: {
    type: Number,
    default: 0,
  },
  skidding: {
    type: Number,
    default: 0,
  },
  placement: {
    type: String,
    default: 'top',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  shown: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <Tooltip :disabled="disabled" :placement="placement" container="#bflex-booking-widget" v-bind="$attrs">
    <slot />
    <template #popper>
      <slot name="popper" />
    </template>
  </Tooltip>
</template>

<style lang="scss">
</style>
