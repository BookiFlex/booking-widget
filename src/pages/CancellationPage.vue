<script setup>
import { defineProps, onMounted, ref, watch, inject, computed } from 'vue'
import BflexInformationBlock from '../components/InformationBlock/BflexInformationBlock.vue'
import BflexHeader from '../components/InformationBlock/BflexHeader.vue'
import BflexDivider from '../components/InformationBlock/BflexDivider.vue'
import BflexContent from '../components/InformationBlock/BflexContent.vue'
import BflexSkeletonLoader from '../components/ui/BflexSkeletonLoader.vue'
import BflexHotelInformationCard from '@/components/BflexHotelInformationCard.vue'
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue'
import BflexButton from '@/components/ui/BflexButton.vue'
import BflexFieldDecorator from '@/components/ui/BflexFieldDecorator.vue'
import { useReservation } from '@/composables/useReservation.js'
import BflexReadOnlyAccommodationCard from '@/components/BflexReadOnlyAccommodationCard.vue'
import { formatMoney } from '../util/money.js'

const props = defineProps({
  sid: {
    type: String,
    required: true,
    default: '',
  },
})

const t = {
  title: window.wp.i18n.__('Cancel Reservation', 'bookiflex'),
  description: window.wp.i18n.__('Enter the cancellation code from your confirmation email', 'bookiflex'),
  paid: window.wp.i18n.__('Amount Paid', 'bookiflex'),
  penalty: window.wp.i18n.__('Cancellation Penalty', 'bookiflex'),
  refund: window.wp.i18n.__('Refund Amount', 'bookiflex'),
  cancellationRulesTitle: window.wp.i18n.__('Cancellation Rules', 'bookiflex'),
  codeHelp: window.wp.i18n.__('Code from email:', 'bookiflex'),
  codeLabel: window.wp.i18n.__('Cancellation Code', 'bookiflex'),
  action: window.wp.i18n.__('Cancel Reservation', 'bookiflex'),
  rules: window.wp.i18n.__('Cancellation Rules', 'bookiflex'),
  'result.success': window.wp.i18n.__('Reservation cancelled successfully', 'bookiflex'),
  'result.error': window.wp.i18n.__('Error cancelling reservation', 'bookiflex')
}

const settings = inject('settings')
const { setError } = inject('globalError')

const cancellationCode = ref('')
const cancellationInProgress = ref(false)

// Используем composable
const { reservation, loading, loadReservation, cancelReservation } = useReservation()

const loadReservationData = async () => {
  if (!props.sid) return

  try {
    await loadReservation(props.sid)
  } catch (error) {
    setError(error)
  }
}

const penaltyAmount = computed(() => {
  const penalties = reservation.value.status === 'CANCELLED'
    ? reservation.value.cancellation.penalties
    : reservation.value.cancellation.estimatedPenalties;

  return penalties.reduce((acc, cur) => {
    acc += cur.amount
    return acc
  }, 0)
})

const onClickAction = async () => {
  cancellationInProgress.value = true
  try {
    const result = await cancelReservation(props.sid, cancellationCode.value)
    if (result.successful) {
      alert(t['result.success'])
      window.location.replace(window.location.origin)
    } else {
      alert(t['result.error'])
      cancellationCode.value = ''
    }
  } catch (error) {
    setError(error)
    alert(t['result.error'])
  } finally {
    cancellationInProgress.value = false
  }
}

watch(() => props.sid, loadReservationData)
onMounted(loadReservationData)
</script>

<template>
  <BflexGridGap>
    <BflexSkeletonLoader v-if="loading"></BflexSkeletonLoader>
    <template v-else-if="reservation">
      <section class="reservation-result">
        <div class="reservation-result__title">{{ t.title }}</div>
        <div class="reservation-result__description">
          {{ t.description }}
        </div>
      </section>

      <BflexReadOnlyAccommodationCard
        :reservation="reservation"
        :locale="settings.widget.locale"
      >
        <BflexContent>
          <dl class="accommodation-list__payment-rules">
            <dt>{{ t.paid }}:</dt>
            <dd>
              {{ formatMoney(reservation.payment.amounts.paid, reservation.currency)  }}
            </dd>

            <dt class="highlighted">{{ t.penalty }}:</dt>
            <dd class="highlighted">
              {{ formatMoney(penaltyAmount, reservation.currency) }}
            </dd>
          </dl>
        </BflexContent>
        <BflexDivider></BflexDivider>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: end;
            column-gap: 0.5rem;
            padding: 1rem;
            align-items: center;
          "
        >
          <div>{{ t.codeHelp }}</div>
          <BflexFieldDecorator :label="t.codeLabel" hide-hint>
            <input
              name="cancellationCode"
              :value="cancellationCode"
              @input.stop="(e) => (cancellationCode = e.currentTarget.value)"
              :disabled="cancellationInProgress"
            />
          </BflexFieldDecorator>
          <BflexButton
            @click="onClickAction"
            :disabled="!cancellationCode || cancellationInProgress"
          >
            {{ t.action }}
          </BflexButton>
        </div>
      </BflexReadOnlyAccommodationCard>

      <BflexInformationBlock class="information-block--attention">
        <BflexHeader>{{ t.rules }}</BflexHeader>
        <BflexDivider></BflexDivider>
        <BflexContent>
          <ul class="agreement-rules-list__rules">
            <li
              v-for="(item, index) in reservation.cancellation.policy.consequences"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </BflexContent>
      </BflexInformationBlock>

      <BflexHotelInformationCard :hotel-info="settings.hotelInfo" />
    </template>
  </BflexGridGap>
</template>
