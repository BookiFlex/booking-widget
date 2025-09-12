<!-- BookingWidget.vue -->
<script setup>
import { ref, onMounted, provide, inject, defineProps, onUnmounted, watch, toRaw } from 'vue'
import { init } from './api/api.js'
import i18n from './i18n'
import {
  CHOOSE_ACCOMMODATION,
  BOOKING_CONFIRMATION,
  CANCEL_RESERVATION,
  EMPTY_CART
} from './constants.js'
import ChooseAccommodationPage from '@/pages/ChooseAccommodationPage.vue'
import BookingConfirmationPage from '@/pages/ConfirmationPage.vue'
import ReservationDetailsPage from '@/pages/ResultPage.vue'
import CancelReservationPage from '@/pages/CancelReservationPage.vue'
import BflexSkeletonLoader from '@/components/ui/BflexSkeletonLoader.vue'
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue'
import { useBookingFlow } from '@/composables/useBookingFlow.js'
import { useLoading } from '@/composables/useLoading.js'

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

// Settings
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

// Search params
const searchParams = ref({
  start: props.start,
  end: props.end,
  promoCode: props.promoCode,
})

// Используем composables
const { activePage, reservationSid, nextPage, startCancellation } = useBookingFlow()
const { loading, withLoading } = useLoading(false)

// Container ref для скролла
const container = ref(null)

// Error handler
const { setError } = inject('globalError')

// Отслеживаем изменения props
watch(
  () => ({ start: props.start, end: props.end, promoCode: props.promoCode }),
  (newValue) => {
    searchParams.value = newValue
  }
)

// Отслеживаем изменения searchParams
watch(
  searchParams,
  (value, prevValue) => {
    if (!value.start || !value.end) {
      return
    }

    const hasChanges = !prevValue ||
      !prevValue.start ||
      !prevValue.end ||
      prevValue.start !== value.start ||
      prevValue.end !== value.end

    if (hasChanges) {
      window.dispatchEvent(
        new CustomEvent('bflex:booking-widget:changed', {
          detail: toRaw(searchParams.value)
        })
      )
    }
  },
  { immediate: true, deep: true }
)

// Обработчик изменения параметров поиска извне
const onSearchParamsChanged = (e) => {
  const { start, end, promoCode } = e.detail
  searchParams.value = { start, end, promoCode }
  e.stopPropagation()
}

// Обработчик действий от дочерних компонентов
const onReleasedAction = ({ action, result }) => {
  // Скроллим наверх при навигации
  if (container.value) {
    container.value.scrollTop = 0
  }

  if (action === EMPTY_CART) {
    nextPage(null)
  } else if (action === BOOKING_CONFIRMATION) {
    nextPage(action, result)
  } else {
    nextPage(action)
  }
}

// Инициализация
onMounted(async () => {
  window.dispatchEvent(new CustomEvent('bflex:booking-widget:ready'))
  window.addEventListener('bflex:search-bar:search', onSearchParamsChanged)

  await withLoading(async () => {
    try {
      const { inProgress, settings: appSettings } = await init()
      settings.value = appSettings

      // Настройка локализации
      const { widget } = appSettings
      if (widget?.locale && widget?.l10n && Object.keys(widget.l10n).length) {
        i18n.global.locale.value = widget.locale
        i18n.global.setLocaleMessage(widget.locale, widget.l10n)
      }

      // Проверяем параметры URL
      const params = new URLSearchParams(window.location.search)
      if (params.has('cancelReservation')) {
        const sid = params.get('cancelReservation')
        startCancellation(sid)
      } else {
        nextPage(inProgress ? CHOOSE_ACCOMMODATION : null)
      }
    } catch (error) {
      setError(error)
    }
  })

  // Добавляем задержку для синхронизации лоадеров
  if (loading.value) {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
})

// Очистка
onUnmounted(() => {
  window.removeEventListener('bflex:search-bar:search', onSearchParamsChanged)
})
</script>

<template>
  <main id="bflex-booking-widget">
    <div class="booking-widget">
      <section ref="container" class="booking-widget__content">
        <!-- Loading state -->
        <template v-if="loading">
          <BflexGridGap>
            <BflexSkeletonLoader v-for="i in 3" :key="i"></BflexSkeletonLoader>
          </BflexGridGap>
        </template>

        <!-- Cancel reservation page -->
        <CancelReservationPage
          v-else-if="activePage === CANCEL_RESERVATION && reservationSid"
          :sid="reservationSid"
          @cancelReservation="() => nextPage(null)"
        />

        <!-- Choose accommodation page -->
        <ChooseAccommodationPage
          v-else-if="activePage === CHOOSE_ACCOMMODATION"
          :dateRange="searchParams"
          :promoCode="searchParams.promoCode"
          @released="onReleasedAction"
        />

        <!-- Booking confirmation page -->
        <BookingConfirmationPage
          v-else-if="activePage === BOOKING_CONFIRMATION"
          @released="onReleasedAction"
        />

        <!-- Reservation details page -->
        <ReservationDetailsPage
          v-else-if="activePage === RESERVATION_DETAILS"
          :sid="reservationSid"
          @released="onReleasedAction"
        />
      </section>
    </div>
  </main>
</template>

<style lang="scss">
@use './assets/css/index.scss';
</style>
