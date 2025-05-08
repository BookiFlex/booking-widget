<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
import CycleLoader from '@/components/ui/CycleLoader.vue'
</script>

<template>
  <button class="button" :disabled="disabled">
    <CycleLoader v-if="loading" size="10px" color="#fff"></CycleLoader>
    <slot v-else />
  </button>
</template>

<style scoped lang="scss">
</style>
