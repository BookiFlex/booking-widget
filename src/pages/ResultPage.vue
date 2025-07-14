<script setup>
import { defineProps, onMounted, ref, watch, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { loadReservation } from '../api/api.js'
import BflexChosenAccommodationsCard from '../components/BflexChosenAccommodationsCard.vue'
import BflexInformationBlock from '../components/InformationBlock/BflexInformationBlock.vue'
import BflexHeader from '../components/InformationBlock/BflexHeader.vue'
import BflexDivider from '../components/InformationBlock/BflexDivider.vue'
import BflexContent from '../components/InformationBlock/BflexContent.vue'
import BflexSkeletonLoader from '../components/ui/BflexSkeletonLoader.vue'
import BflexHotelInformationCard from '@/components/BflexHotelInformationCard.vue'
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue'
import { convertStatus } from '../util/text.js'
import BflexPaymentPanel from '@/components/BflexPaymentPanel.vue'
import BflexRedirectTimer from '@/components/BflexRedirectTimer.vue'

const props = defineProps({
  sid: {
    type: String,
    required: true,
    default: '',
  },
})
const { t } = useI18n()

const settings = inject('settings')
const data = ref(null)
const captureTokens = ref([])
const loading = ref(true)

const { setError } = inject('globalError')

const loadReservationCallback = async () => {
  if (!props.sid) {
    return
  }

  loading.value = true
  try {
    const result = await loadReservation({ sid: props.sid })
    data.value = result.data
    // captureTokens.value = result.captureTokens
  } catch (error) {
    setError(error)
  } finally {
    loading.value = false
  }
}

const statusText = computed(() => {
  if (data.value?.reservation) {
    return convertStatus(data.value.reservation.status)
  }

  return ''
})

const onClickAction = () => {
  captureTokens.value.forEach((token) => {
    console.log(token)
    window.open(token, '_blank')
  })
}

watch(() => props.sid, loadReservationCallback)
onMounted(loadReservationCallback)
</script>

<template>
  <BflexGridGap>
    <BflexSkeletonLoader v-if="loading"></BflexSkeletonLoader>
    <template v-else>
      <section class="reservation-result">
        <div class="reservation-result__title">{{ t('reservation.title') }}</div>
        <div class="reservation-result__description">
          {{ t(`reservation.description.${statusText}`) }}
        </div>
      </section>

      <BflexChosenAccommodationsCard
        mode="info"
        :reservation="data.reservation"
        :summary="data.summary"
        :payment="data.payment"
        :locale="settings.widget.locale"
      ></BflexChosenAccommodationsCard>

      <BflexInformationBlock class="information-block--attention">
        <BflexHeader>{{ t('reservation.whatIsNext') }}</BflexHeader>
        <BflexDivider></BflexDivider>
        <BflexContent>{{
          t(`reservation.nextStep.${statusText}`, { untilTime: '' })
        }}</BflexContent>
        <template v-if="data.payment.captureToken">
          <BflexRedirectTimer :capture-token="data.payment.captureToken" :timeout="30" blank />
        </template>
      </BflexInformationBlock>

      <BflexInformationBlock v-if="data.reservation.specialRequest">
        <BflexHeader>{{ t('reservation.specialRequest') }}</BflexHeader>
        <BflexDivider></BflexDivider>
        <BflexContent>{{ data.reservation.specialRequest }}</BflexContent>
      </BflexInformationBlock>

      <BflexHotelInformationCard :hotel-info="settings.hotelInfo" />

      <BflexPaymentPanel
        v-if="captureTokens.length"
        :prepayment="data.payment.prepayment"
        :currency="data.currency"
        @click="onClickAction"
      >
      </BflexPaymentPanel>
    </template>
  </BflexGridGap>
</template>

<style lang="scss"></style>
