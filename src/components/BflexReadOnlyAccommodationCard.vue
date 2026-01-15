<script setup>
import { defineProps, computed } from 'vue'
import { formatDateRange } from '../util/date.js'
import BflexDivider from './InformationBlock/BflexDivider.vue'
import BflexContent from './InformationBlock/BflexContent.vue'
import BflexInformationBlock from './InformationBlock/BflexInformationBlock.vue'
import BflexHeader from './InformationBlock/BflexHeader.vue'
import BflexSkeletonLoader from '@/components/ui/BflexSkeletonLoader.vue'
import BflexTooltip from '@/components/ui/BflexTooltip.vue'
import BflexIconText from '@/components/ui/BflexIconText.vue'
import { formatMoney } from '../util/money.js'

const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
  locale: {
    type: String,
    default: 'en',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showCancellationPolicy: {
    type: Boolean,
    default: true,
  },
})

const t = {
  title: window.wp.i18n.__('Your Stay', 'bookiflex'),
  adults: window.wp.i18n.__('%d adults', 'bookiflex'),
  children: window.wp.i18n.__('%d children', 'bookiflex'),
  paymentMethod: window.wp.i18n.__('Payment Method', 'bookiflex'),
  totalAmount: window.wp.i18n.__('Total Amount', 'bookiflex'),
  prepaymentAmount: window.wp.i18n.__('Prepayment Amount', 'bookiflex'),
  onArrivalAmount: window.wp.i18n.__('On Arrival Amount', 'bookiflex')
}

const guestsText = computed(() => ({
  adults: window.wp.i18n.sprintf(t.adults, props.reservation.stay.guests.adults),
  children: window.wp.i18n.sprintf(t.children, props.reservation.stay.guests.children.length)
}))
</script>

<template>
  <BflexSkeletonLoader v-if="loading" is-result></BflexSkeletonLoader>

  <BflexInformationBlock v-else class="accommodation-info">
    <BflexHeader>{{ t.title }}</BflexHeader>
    <BflexDivider></BflexDivider>

    <BflexContent>
      <dl class="text-sm stay-information">
        <dt>
          <BflexIconText icon="DateRange">{{
            formatDateRange(reservation.stay.checkInDate, reservation.stay.checkOutDate, locale)
          }}</BflexIconText>
        </dt>
        <dd>
          <BflexIconText icon="Persons">
            {{ guestsText.adults }}, {{ guestsText.children }}
          </BflexIconText>
        </dd>
      </dl>
    </BflexContent>
    <BflexDivider></BflexDivider>

    <BflexContent>
      <dl class="accommodation-info__item">
        <dt>
          <h3>{{ reservation.accommodation.type.name }} ({{ reservation.accommodation.ratePlan.name }})</h3>
          <div
            v-if="showCancellationPolicy && reservation.cancellation"
            class="text-sm"
            style="line-height: 1.25; font-weight: lighter"
          >
            <BflexTooltip class="inline">
              <abbr>{{ reservation.cancellation.policy.name || '' }}</abbr>
              <template #popper>
                <p
                  v-for="(i, index) in reservation.cancellation.policy.consequences"
                  :key="index"
                >
                  {{ i }}
                </p>
              </template>
            </BflexTooltip>
          </div>
        </dt>
        <dd>
          {{ formatMoney(reservation.totalAmount, reservation.currency) }}
        </dd>
      </dl>

      <!-- Отображение выбранного типа оплаты (только для чтения) -->
      <div v-if="reservation.paymentType" class="payment-info">
        <span class="payment-info__label">{{ t.paymentMethod }}:</span>
        <span class="payment-info__value">{{ reservation.paymentType.name }}</span>
      </div>
    </BflexContent>
    <BflexDivider></BflexDivider>

    <BflexContent>
      <dl class="accommodation-info__total">
        <dt>{{ t.totalAmount }}:</dt>
        <dd>
          <strong>{{ formatMoney(reservation.totals.total, reservation.totals.currency) }}</strong>
        </dd>
      </dl>
    </BflexContent>
    <BflexDivider></BflexDivider>

    <slot>
      <BflexContent>
        <dl class="accommodation-info__payment-rules">
          <dt class="highlighted">{{ t.prepaymentAmount }}:</dt>
          <dd class="highlighted">
            {{ formatMoney(reservation.payment.amounts.prepayment, reservation.currency)  }}
          </dd>
          <dt>{{ t.onArrivalAmount }}:</dt>
          <dd>
            <span>{{ formatMoney(reservation.payment.amounts.onArrival || 0, reservation.currency) }}</span>
          </dd>
        </dl>
      </BflexContent>
    </slot>
  </BflexInformationBlock>
</template>

<style lang="scss">
// Стили для компонента только для чтения

</style>
