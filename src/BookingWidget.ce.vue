<script setup>
import { defineProps, onBeforeMount, ref, getCurrentInstance, watch } from 'vue'
import BookingWidget from './BookingWidget.vue'
import BflexErrorProvider from '@/components/BflexErrorProvider.vue'
import i18n from '@/i18n.js'

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
        ratePlans: value.accommodationTypes.split(','),
      }
    }
  },
)

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
  <BflexErrorProvider>
    <BookingWidget
      :start="start"
      :end="end"
      :promo-code="promoCode"
      :accommodation-types="preparedParams.accommodationTypes"
      :ratePlans="preparedParams.ratePlans"
    />
  </BflexErrorProvider>
</template>

<style lang="scss">
@use './assets/css/index.scss';
</style>
