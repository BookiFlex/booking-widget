<script setup>
import { ref, onMounted, provide, defineProps, onUnmounted, watch, inject } from 'vue'
import { init } from './api/api.js'
import i18n from './i18n'
import { CHOOSE_ACCOMMODATION, BOOKING_CONFIRMATION, EMPTY_CART, RESERVATION_DETAILS } from './constants.js'
import ChooseAccommodationPage from '@/pages/ChooseAccommodationPage.vue'
import BookingConfirmationPage from '@/pages/ConfirmationPage.vue'
import ReservationDetailsPage from '@/pages/ResultPage.vue'

const props = defineProps({
  dateRange: {
    type: Object,
    default: () => ({
      start: null,
      end: null,
    }),
  },
  promoCode: {
    type: String,
    default: null,
  },
  accommodationTypes: {
    type: Array,
    default: () => [],
  },
  ratePlans: {
    type: Array,
    default: () => [],
  },
})

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

const pages = [
  CHOOSE_ACCOMMODATION,
  BOOKING_CONFIRMATION,
  RESERVATION_DETAILS,
]
const activePage = ref(null)

const nextPage = (action) => {
  const index = pages.indexOf(action)
  if (index >= 0 && index < pages.length - 1) {
    activePage.value = pages[index + 1]
  }
}

const loading = ref(false)
const sid = ref('')

watch(
  () => props.dateRange,
  (value, prevValue) => {
    if (!value.start || !value.end) {
      return
    }

    if (
      !prevValue ||
      !prevValue.start ||
      !prevValue.end ||
      prevValue.start !== value.start ||
      prevValue.end !== value.end
    ) {
      window.dispatchEvent(
        new CustomEvent('bflex:booking-widget:changed', { detail: props.dateRange }),
      )
    }
  },
  {
    immediate: true,
  },
)

const { setError } = inject('globalError')

onMounted(async () => {
  window.dispatchEvent(new CustomEvent('bflex:booking-widget:ready'))

  loading.value = true
  try {
    const { inProgress, settings: appSettings } = await init()
    settings.value = appSettings
    const { widget } = appSettings

    if (widget && widget.locale && widget.l10n) {
      i18n.global.locale.value = widget.locale
      i18n.global.setLocaleMessage(widget.locale, widget.l10n)
    }

    activePage.value = inProgress ? BOOKING_CONFIRMATION : CHOOSE_ACCOMMODATION
  } catch (error) {
    setError(error)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  window.dispatchEvent(new CustomEvent('bflex:booking-widget:removed'))
})

const onReleasedAction = ({ action, result }) => {
  if (action === EMPTY_CART) {
    activePage.value = CHOOSE_ACCOMMODATION
  } else if (action === BOOKING_CONFIRMATION) {
    sid.value = result.reservations[0]
    nextPage(action)
  } else {
    nextPage(action)
  }
}
</script>

<template>
  <main id="bflex-booking-widget">
    <div class="booking-widget">
      <section class="booking-widget__content">
        <ChooseAccommodationPage
          v-if="activePage === CHOOSE_ACCOMMODATION"
          :dateRange="dateRange"
          :promoCode="promoCode"
          @released="onReleasedAction"
        ></ChooseAccommodationPage>
        <BookingConfirmationPage
          v-else-if="activePage === BOOKING_CONFIRMATION"
          @released="onReleasedAction"
        ></BookingConfirmationPage>
        <ReservationDetailsPage
          v-else-if="activePage === RESERVATION_DETAILS"
          :sid="sid"
          @released="onReleasedAction"
        ></ReservationDetailsPage>
      </section>
    </div>
  </main>
</template>

<style lang="scss">
@use './assets/css/index.scss';
</style>
