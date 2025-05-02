<template>
  <component
    :is="iconComponent"
    v-bind="$attrs"
    class="icon"
    :class="small ? 'icon--small' : 'icon'"
  />
</template>

<script setup>
import { computed, defineProps } from 'vue'
import * as icons from '@/assets/icons'

const props = defineProps({
  name: { type: String, required: true },
  small: {
    type: Boolean,
    default: false
  }
})

const iconComponent = computed(() => icons[props.name] || null)
</script>

<style lang="scss">
.icon {
  width: 24px;
  height: 24px;
  fill: currentColor;

  &--small {
    width: 16px;
    height: 16px;
  }
}
</style>
