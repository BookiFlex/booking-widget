<script setup>
import { defineProps } from 'vue'
import BflexIcon from '@/components/ui/BflexIcon.vue'

defineProps({
  prepayment: {
    type: String,
    default: '0',
  },
  currency: {
    type: String,
    default: 'EUR',
  },
})

const t = {
  prepayment: window.wp.i18n.__('Prepayment required', 'bookiflex')
}
</script>

<template>
  <div class="summary-block">
    <div class="summary-block__content">
      <div class="summary-block__content-info">
        <div class="summary-block__content-info__price">
          <span>{{ prepayment }}</span> {{ currency }}
        </div>
        <div class="summary-block__content-info__text">
          {{ t.prepayment }}
          <BflexIcon class="accommodation-summary-trigger" name="Info" small></BflexIcon>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss"></style>
