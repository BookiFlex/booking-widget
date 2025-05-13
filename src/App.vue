<script setup>
import BookingWidget from './BookingWidget.vue'
import BflexErrorProvider from '@/components/BflexErrorProvider.vue'
import { onUnmounted } from 'vue'

defineProps({
  start: {
    type: String,
    default: '',
  },
  end: {
    type: String,
    default: '',
  },
  promoCode: {
    type: String,
    default: '',
  },
  accommodationTypes: {
    type: Array,
    default: () => [],
  },
  ratePlans: {
    type: Array,
    default: () => [],
  },
})

onUnmounted(() => {
  window.dispatchEvent(new CustomEvent('bflex:booking-widget:removed'))
})
</script>

<template>
  <BflexErrorProvider>
    <BookingWidget
      :start="start"
      :end="end"
      :promo-code="promoCode"
      :accommodation-types="accommodationTypes"
      :ratePlans="ratePlans"
    />
  </BflexErrorProvider>
</template>

<style scoped lang="scss"></style>
