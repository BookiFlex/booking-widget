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
@forward "assets/css/material-icons.scss";
@forward "assets/css/loader.scss";
@forward "assets/css/button.scss";
@forward "assets/css/accommodation-offer-block";
@forward "assets/css/accommodation-rules-block";
@forward "assets/css/result-page.scss";
@forward 'assets/css/accommodation-card.scss';
@forward 'assets/css/accommodation-type-card.scss';
@forward 'assets/css/booking-widget.scss';
@forward 'assets/css/checkbox.scss';
@forward 'assets/css/contact-information-block';
@forward 'assets/css/field-decorator.scss';
@forward 'assets/css/summary-block';
@forward 'assets/css/information-block.scss';
@forward 'assets/css/price-block.scss';
@forward 'assets/css/rate-plan-card.scss';
@forward 'assets/css/rate-plan-variant.scss';
@forward 'assets/css/sceleton.scss';
@forward 'assets/css/scenario-icon.scss';
</style>
