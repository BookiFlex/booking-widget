<script setup>
import { defineProps, onMounted, watch, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BflexChosenAccommodationsCard from '../components/BflexChosenAccommodationsCard.vue'
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

const props = defineProps({
  sid: {
    type: String,
    required: true,
    default: '',
  },
})

const { t } = useI18n()
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
        <div class="reservation-result__title">{{ t('reservation.title') }}</div>
        <div class="reservation-result__description">
          {{ t(`reservation.description.${statusText}`) }}
        </div>
      </section>

      <BflexChosenAccommodationsCard
        mode="info"
        :reservation="reservation.reservation"
        :summary="reservation.summary"
        :payment="reservation.payment"
        :locale="settings.widget.locale"
      ></BflexChosenAccommodationsCard>

      <BflexInformationBlock class="information-block--attention">
        <BflexHeader>{{ t('reservation.whatIsNext') }}</BflexHeader>
        <BflexDivider></BflexDivider>
        <BflexContent>{{
            t(`reservation.nextStep.${statusText}`, { untilTime: '' })
          }}</BflexContent>
        <template v-if="reservation.payment?.captureToken">
          <BflexRedirectTimer :capture-token="reservation.payment.captureToken" :timeout="30" blank />
        </template>
      </BflexInformationBlock>

      <BflexInformationBlock v-if="reservation.reservation?.specialRequest">
        <BflexHeader>{{ t('reservation.specialRequest') }}</BflexHeader>
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
