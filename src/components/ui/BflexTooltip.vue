<script setup>
import { defineProps } from 'vue'
import { Tooltip } from 'floating-vue'

defineProps({
  trigger: {
    type: [String, Array],
    default: () => ['click', 'touch', 'hover'],
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
  <Tooltip
    :triggers="trigger"
    :disabled="disabled"
    :placement="placement"
    :container="false"
    v-bind="$attrs"
    auto-hide
  >
    <slot />
    <template #popper>
      <slot name="popper" />
    </template>
  </Tooltip>
</template>

<style lang="scss"></style>
