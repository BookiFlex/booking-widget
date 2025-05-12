<script setup>
import BflexIcon from '@/components/ui/BflexIcon.vue'

defineProps({
  icon: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="icon-text">
    <span class="icon-text__icon"><BflexIcon :name="icon"></BflexIcon></span>
    <span class="icon-text__text"><slot /></span>
  </div>
</template>

<style scoped lang="scss"></style>
