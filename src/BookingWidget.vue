<!-- BookingWidget.vue -->
<script setup>
import { ref, onMounted, provide, inject, defineProps, onUnmounted, watch, toRaw, nextTick } from 'vue'
import { init } from './api/api.js'
import i18n from './i18n'
import {
  CHOOSE_ACCOMMODATION,
  BOOKING_CONFIRMATION,
  RESERVATION_DETAILS,
  CANCEL_RESERVATION,
  EMPTY_CART
} from './constants.js'
import OffersPage from '@/pages/OffersPage.vue'
import BookingConfirmationPage from '@/pages/ConfirmationPage.vue'
import ReservationDetailsPage from '@/pages/ResultPage.vue'
import CancellationPage from '@/pages/CancellationPage.vue'
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
const { activePage, reservationSid, nextPage: navigateNext, startCancellation } = useBookingFlow()
const { loading, withLoading } = useLoading(false)

// Container ref для скролла
const container = ref(null)

// Transition state
const isTransitioning = ref(false)

// Error handler
const { setError } = inject('globalError')

// Smooth scroll to top
const scrollToTop = () => {
  if (container.value) {
    container.value.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

// Enhanced page navigation with transition
const nextPage = async (action, result = null) => {
  isTransitioning.value = true

  // Небольшая задержка для начала анимации
  await nextTick()

  setTimeout(() => {
    scrollToTop()

    if (action === EMPTY_CART) {
      navigateNext(null)
    } else if (action === BOOKING_CONFIRMATION) {
      navigateNext(action, result)
    } else {
      navigateNext(action)
    }

    // Завершаем переход
    setTimeout(() => {
      isTransitioning.value = false
    }, 300)
  }, 150)
}

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
  console.log(`Released action: ${action}`, result)
  nextPage(action, result)
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
      if (params.has('cancel')) {
        const sid = params.get('cancel')
        startCancellation(sid)
      } else {
        navigateNext(inProgress ? CHOOSE_ACCOMMODATION : null)
      }
    } catch (error) {
      setError(error)
    }
  })

  // Плавное завершение начальной загрузки
  if (loading.value) {
    setTimeout(() => {
      loading.value = false
    }, 800)
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
        <CancellationPage
          v-else-if="activePage === CANCEL_RESERVATION && reservationSid"
          :sid="reservationSid"
          @cancelReservation="() => nextPage(null)"
        />

            <!-- Choose accommodation page -->
            <OffersPage
              v-else-if="activePage === CHOOSE_ACCOMMODATION"
              :key="CHOOSE_ACCOMMODATION"
              :date-range="searchParams"
              :promo-code="searchParams.promoCode"
              @released="onReleasedAction"
            />

            <!-- Booking confirmation page -->
            <BookingConfirmationPage
              v-else-if="activePage === BOOKING_CONFIRMATION"
              :key="BOOKING_CONFIRMATION"
              @released="onReleasedAction"
            />

            <!-- Reservation details page -->
            <ReservationDetailsPage
              v-else-if="activePage === RESERVATION_DETAILS"
              :key="RESERVATION_DETAILS"
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
