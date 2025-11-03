<script setup>
import { defineProps, ref, watch, onUnmounted } from 'vue'
import BookingWidget from './BookingWidget.vue'
import BflexErrorProvider from '@/components/BflexErrorProvider.vue'

const props = defineProps({
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
    type: String,
    default: '',
  },
  ratePlans: {
    type: String,
    default: '',
  },
  useUrlParams: {
    type: Boolean,
    default: false,
  },
  syncUrl: {
    type: Boolean,
    default: false,
  },
})

const preparedParams = ref({
  accommodationTypes: [],
  ratePlans: [],
})

watch(
  () => ({ accommodationTypes: props.accommodationTypes, ratePlans: props.ratePlans }),
  (value) => {
    if (value.accommodationTypes.length || value.ratePlans.length) {
      preparedParams.value = {
        accommodationTypes: value.accommodationTypes.split(','),
        ratePlans: value.ratePlans.split(','),
      }
    }
  },
)

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
      :accommodation-types="preparedParams.accommodationTypes"
      :rate-plans="preparedParams.ratePlans"
      :use-url-params="useUrlParams"
      :sync-url="syncUrl"
    />
  </BflexErrorProvider>
</template>

<style lang="scss">
@use './assets/css/index.scss';
</style>
