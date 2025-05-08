<script setup>
import BookingWidget from './BookingWidget.vue'
import { onMounted, ref, toRaw } from 'vue'
import BflexErrorProvider from '@/components/BflexErrorProvider.vue'

const searchParams = ref({
  dateRange: {
    start: null,
    end: null,
  },
  promoCode: null
})

const onSearchHandler = ({ start, end, promoCode: code }) => {
  searchParams.value.dateRange = { start, end }
  searchParams.value.promoCode = code
}

onMounted(() => {
  window.addEventListener('bflex:search-bar:search', (e) => {
    onSearchHandler(e.detail)
  })

  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('bflex:search-bar:search', { detail: { start: '2025-07-01', end: '2025-07-05' } }))
  }, 1000)
})
</script>

<template>
    <BflexErrorProvider>
      <BookingWidget :date-range="toRaw(searchParams.dateRange)" :promo-code="searchParams.promoCode" />
    </BflexErrorProvider>
</template>

<style scoped lang="scss"></style>
