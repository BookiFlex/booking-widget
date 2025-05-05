<script setup>
import { defineProps, nextTick, onMounted, onUnmounted, ref, toRaw } from 'vue'
import BookingWidget from './BookingWidget.vue'
import ErrorProvider from '@/components/ErrorProvider.vue'

const props = defineProps({
  start: {
    type: String,
    default: null,
  },
  end: {
    type: String,
    default: null,
  },
})

const searchParams = ref({
  dateRange: {
    start: props.start,
    end: props.end,
  },
  promoCode: null
})

const onSearchHandler = ({ start, end, promoCode: code }) => {
  searchParams.value.dateRange = { start, end }
  searchParams.value.promoCode = code
}

const handleSearch = (e) => {
  console.log('bflex:search-bar:search (got)', e.detail)
  nextTick(() => {
    onSearchHandler(e.detail)
  })
  e.stopPropagation()
}

onMounted(() => {
  window.addEventListener('bflex:search-bar:search', handleSearch)
})

onUnmounted(() => {
  window.removeEventListener('bflex:search-bar:search', handleSearch)
})
</script>

<template>
  <ErrorProvider>
    <BookingWidget :date-range="toRaw(searchParams.dateRange)" :promo-code="searchParams.promoCode" />
  </ErrorProvider>
</template>

<style lang="scss">
@use './assets/css/index.scss';
</style>
