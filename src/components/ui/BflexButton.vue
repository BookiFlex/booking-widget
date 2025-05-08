<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
import BflexCycleLoader from '@/components/ui/BflexCycleLoader.vue'
</script>

<template>
  <button class="button" :disabled="disabled">
    <BflexCycleLoader v-if="loading" size="10px" color="#fff"></BflexCycleLoader>
    <slot v-else />
  </button>
</template>

<style scoped lang="scss">
</style>
