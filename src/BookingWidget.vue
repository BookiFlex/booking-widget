<script setup>
import { ref, onMounted, provide } from 'vue'
import { updateCart, confirmCart, init } from './api/api.js'
import { SEARCH_PAGE, CONFIRMATION_PAGE, RESULT_PAGE } from './constants.js'
import SearchPage from '@/pages/SearchPage.vue'
import ConfirmationPage from '@/pages/ConfirmationPage.vue'
import ResultPage from '@/pages/ResultPage.vue'

const activePage = ref(null)
const loading = ref(false)
const cart = ref(null)
const sid = ref('')

const settings = ref({
  hotelRules: {
    rules: [],
    agreements: [],
  },
  policies: {
    arrivalPolicy: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
    },
  },
})
provide('settings', settings)

onMounted(async () => {
  loading.value = true
  const { inProgress, settings: appSettings } = await init()
  settings.value = appSettings
  loading.value = false

  activePage.value = inProgress ? CONFIRMATION_PAGE : SEARCH_PAGE
})

const onAddToCartHandler = async ({
  checkInDate,
  checkOutDate,
  accommodationType,
  ratePlan,
  adults,
}) => {
  loading.value = true
  const result = await updateCart({
    checkInDate,
    checkOutDate,
    accommodationType,
    ratePlan,
    adults,
    children: [],
    quantity: 1,
  })
  cart.value = result.cart

  loading.value = false
  activePage.value = CONFIRMATION_PAGE
}
const onDeleteFromCartHandler = async ({
  checkInDate,
  checkOutDate,
  accommodationType,
  ratePlan,
  adults,
  children,
  quantity,
}) => {
  loading.value = true
  const result = await updateCart({
    checkInDate,
    checkOutDate,
    accommodationType,
    ratePlan,
    adults,
    children,
    quantity,
  })
  cart.value = result.cart

  loading.value = false
  if (cart.value.requests.length === 0) {
    activePage.value = SEARCH_PAGE
  }
}
const onConfirmCartHandler = async (data) => {
  loading.value = true
  const result = await confirmCart(data)
  loading.value = false

  if (result && result.reservations) {
    sid.value = result.reservations[0]
    activePage.value = RESULT_PAGE
  }
}
</script>

<template>
  <div id="app" class="bflex-app">
    <div class="wrapper">
      <section class="bflex-app__content">
        <SearchPage
          v-if="activePage === SEARCH_PAGE"
          :loading="loading"
          @addToCart="onAddToCartHandler"
        ></SearchPage>
        <ConfirmationPage
          v-if="activePage === CONFIRMATION_PAGE"
          @deleteFromCart="onDeleteFromCartHandler"
          @confirmCart="onConfirmCartHandler"
        ></ConfirmationPage>
        <ResultPage v-if="activePage === RESULT_PAGE" :sid="sid"></ResultPage>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
@forward './assets/css/booking-widget.scss';
</style>
