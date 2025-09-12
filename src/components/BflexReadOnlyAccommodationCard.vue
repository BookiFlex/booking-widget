<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDateRange } from '../util/date.js'
import BflexDivider from './InformationBlock/BflexDivider.vue'
import BflexContent from './InformationBlock/BflexContent.vue'
import BflexInformationBlock from './InformationBlock/BflexInformationBlock.vue'
import BflexHeader from './InformationBlock/BflexHeader.vue'
import BflexSkeletonLoader from '@/components/ui/BflexSkeletonLoader.vue'
import BflexTooltip from '@/components/ui/BflexTooltip.vue'
import BflexIconText from '@/components/ui/BflexIconText.vue'
import { formatMoney } from '../util/money.js'
import { useCancellationI18n } from '@/composables/index.js'

defineProps({
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

const { t } = useI18n()
const { formatRuleDescription } = useCancellationI18n()
</script>

<template>
  <BflexSkeletonLoader v-if="loading" is-result></BflexSkeletonLoader>

  <BflexInformationBlock v-else class="accommodation-info">
    <BflexHeader>{{ t('chosenAccommodation.title') }}</BflexHeader>
    <BflexDivider></BflexDivider>

    <BflexContent>
      <dl class="text-sm">
        <dt>
          <BflexIconText icon="DateRange">{{
            formatDateRange(reservation.stay.checkInDate, reservation.stay.checkOutDate, locale)
          }}</BflexIconText>
        </dt>
        <dd>
          <BflexIconText icon="Persons">
            {{ t('chosenAccommodation.adults', reservation.stay.guests.adults) }},
            {{ t('chosenAccommodation.children', reservation.stay.guests.children.length) }}
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
                  {{ formatRuleDescription(i) }}
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
        <span class="payment-info__label">{{ t('chosenAccommodation.paymentMethod') }}:</span>
        <span class="payment-info__value">{{ reservation.paymentType.name }}</span>
      </div>
    </BflexContent>
    <BflexDivider></BflexDivider>

    <BflexContent>
      <dl class="accommodation-info__total">
        <dt>{{ t('chosenAccommodation.totalAmount') }}:</dt>
        <dd>
          <strong>{{ formatMoney(reservation.totals.total, reservation.totals.currency) }}</strong>
        </dd>
      </dl>
    </BflexContent>
    <BflexDivider></BflexDivider>

    <slot>
      <BflexContent>
        <dl class="accommodation-info__payment-rules">
          <dt class="highlighted">{{ t('chosenAccommodation.prepaymentAmount') }}:</dt>
          <dd class="highlighted">
            {{ formatMoney(reservation.payment.amounts.prepayment, reservation.currency)  }}
          </dd>
          <dt>{{ t('chosenAccommodation.onArrivalAmount') }}:</dt>
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
