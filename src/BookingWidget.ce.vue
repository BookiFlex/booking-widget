<script setup>
import { defineProps, nextTick, onBeforeMount, onMounted, onUnmounted, ref, toRaw, getCurrentInstance } from 'vue'
import BookingWidget from './BookingWidget.vue'
import ErrorProvider from '@/components/ErrorProvider.vue'
import i18n from '@/i18n.js'

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

// Монтируем вручную, потому что provide/inject тут не сработает
onBeforeMount(() => {
  const app = getCurrentInstance()?.appContext.app
  if (app && !app.__i18n_installed) {
    app.use(i18n)
    app.__i18n_installed = true
  }
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
