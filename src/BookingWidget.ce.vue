<script setup>
import { defineProps, nextTick, onMounted, onUnmounted, ref, toRaw } from 'vue'
import BookingWidget from './BookingWidget.vue'

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
  <BookingWidget :date-range="toRaw(searchParams.dateRange)" :promo-code="searchParams.promoCode" />
</template>

<style lang="scss">
@forward "floating-vue/dist/style.css";
@forward "glightbox/dist/css/glightbox.css";
@forward './assets/css/index.scss';
</style>
