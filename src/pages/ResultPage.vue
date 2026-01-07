<script setup>
import { defineProps, onMounted, watch, inject, computed } from 'vue'
import BflexInformationBlock from '../components/InformationBlock/BflexInformationBlock.vue'
import BflexHeader from '../components/InformationBlock/BflexHeader.vue'
import BflexDivider from '../components/InformationBlock/BflexDivider.vue'
import BflexContent from '../components/InformationBlock/BflexContent.vue'
import BflexSkeletonLoader from '../components/ui/BflexSkeletonLoader.vue'
import BflexHotelInformationCard from '@/components/BflexHotelInformationCard.vue'
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue'
import BflexPaymentPanel from '@/components/BflexPaymentPanel.vue'
import BflexRedirectTimer from '@/components/BflexRedirectTimer.vue'
import { useReservation } from '@/composables/useReservation.js'
import BflexReadOnlyAccommodationCard from '@/components/BflexReadOnlyAccommodationCard.vue'

const props = defineProps({
  sid: {
    type: String,
    required: true,
    default: '',
  },
})

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

const t = {
  title: window.wp.i18n.__('Reservation Completed', 'bookiflex'),
  'description.waitingPayment': window.wp.i18n.__('Please make a prepayment to confirm your booking.', 'bookiflex'),
  'description.waitingConfirmation': window.wp.i18n.__('We will try to confirm your booking as soon as possible.', 'bookiflex'),
  'description.confirmed': window.wp.i18n.__('Your booking has been successfully confirmed.', 'bookiflex'),
  'description.cancelled': window.wp.i18n.__('Your booking has been cancelled.', 'bookiflex'),
  'description.overdue': window.wp.i18n.__('The payment time for your booking has expired. It will be cancelled soon.', 'bookiflex'),
  whatIsNext: window.wp.i18n.__('What happens next?', 'bookiflex'),
  'nextStep.waitingPayment': window.wp.i18n.__('You can pay now to secure your reservation. We\'ll hold it for a limited time %s — if no payment is received, it may be automatically cancelled.', 'bookiflex'),
  'nextStep.waitingConfirmation': window.wp.i18n.__('We\'re checking availability and will notify you once your booking is confirmed. Please wait — this usually takes no more than 24 hours.', 'bookiflex'),
  'nextStep.confirmed': window.wp.i18n.__('Thank you for your reservation! You\'ll receive a confirmation email with all details shortly. If you have any questions, feel free to contact us.', 'bookiflex'),
  'nextStep.cancelled': window.wp.i18n.__('Unfortunately, this booking is no longer valid. If you still wish to travel, please make a new reservation.', 'bookiflex'),
  'nextStep.overdue': window.wp.i18n.__('If you still want to keep your booking, please contact us as soon as possible. Otherwise, it will be automatically cancelled.', 'bookiflex'),
  specialRequest: window.wp.i18n.__('Special Requests', 'bookiflex')
}

const descriptionTxt = computed(() => t[`description.${statusText.value}`] || statusText.value)

const nextStepTxt = computed(() => {
  const baseText = t[`nextStep.${statusText.value}`]
  if (!baseText) return statusText.value

  if (statusText.value === 'waitingPayment' && reservation.value?.payment?.status?.waitingUntil) {
    const formattedDate = formatDateTime(reservation.value.payment.status.waitingUntil)
    return window.wp.i18n.sprintf(baseText, formattedDate)
  }

  return baseText
})

const settings = inject('settings')
const { setError } = inject('globalError')

// Используем composable
const { reservation, loading, statusText, loadReservation } = useReservation()
const captureTokens = computed(() => {
  // Временно возвращаем пустой массив
  return []
})

const loadReservationData = async () => {
  if (!props.sid) return

  try {
    await loadReservation(props.sid)
  } catch (error) {
    console.error(error)
    setError(error)
  }
}

watch(() => props.sid, loadReservationData)
onMounted(loadReservationData)

const onClickAction = () => {
  captureTokens.value.forEach((token) => {
    window.open(token, '_blank')
  })
}
</script>

<template>
  <BflexGridGap>
    <BflexSkeletonLoader v-if="loading"></BflexSkeletonLoader>
    <template v-else-if="reservation">
      <section class="reservation-result">
        <div class="reservation-result__title">{{ t.title }}</div>
        <div class="reservation-result__description">
          {{ descriptionTxt }}
        </div>
      </section>

      <BflexReadOnlyAccommodationCard
        :reservation="reservation"
        :locale="settings.widget.locale"
      ></BflexReadOnlyAccommodationCard>

      <BflexInformationBlock class="information-block--attention">
        <BflexHeader>{{ t.whatIsNext }}</BflexHeader>
        <BflexDivider></BflexDivider>
        <BflexContent>{{ nextStepTxt }}</BflexContent>
        <template v-if="reservation.payment?.method?.captureToken">
          <BflexRedirectTimer :capture-token="reservation.payment?.method?.captureToken" :timeout="30" />
        </template>
      </BflexInformationBlock>

      <BflexInformationBlock v-if="reservation.reservation?.specialRequest">
        <BflexHeader>{{ t.specialRequest }}</BflexHeader>
        <BflexDivider></BflexDivider>
        <BflexContent>{{ reservation.reservation.specialRequest }}</BflexContent>
      </BflexInformationBlock>

      <BflexHotelInformationCard :hotel-info="settings.hotelInfo" />

      <BflexPaymentPanel
        v-if="captureTokens.length"
        :prepayment="reservation.payment?.prepayment"
        :currency="reservation.currency"
        @click="onClickAction"
      ></BflexPaymentPanel>
    </template>
  </BflexGridGap>
</template>
