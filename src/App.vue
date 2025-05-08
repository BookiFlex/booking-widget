<script setup>
import BookingWidget from './BookingWidget.vue'
import BflexErrorProvider from '@/components/BflexErrorProvider.vue'

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
  }
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
