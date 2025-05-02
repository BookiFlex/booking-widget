<script setup>
import BookingWidget from './BookingWidget.vue'
import { onMounted, ref, toRaw } from 'vue'

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
    console.log('bflex:search', e.detail)
    onSearchHandler(e.detail)
  })
})
</script>

<template>
  <BookingWidget :date-range="toRaw(searchParams.dateRange)" :promo-code="searchParams.promoCode" />
</template>

<style scoped lang="scss"></style>
