<script setup>
import { defineProps, ref, onMounted, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDateRange } from '../util/date.js'
import BflexDivider from './InformationBlock/BflexDivider.vue'
import BflexContent from './InformationBlock/BflexContent.vue'
import BflexInformationBlock from './InformationBlock/BflexInformationBlock.vue'
import BflexHeader from './InformationBlock/BflexHeader.vue'
import BflexSkeletonLoader from '@/components/ui/BflexSkeletonLoader.vue'
import { useFormattedCancellationPolicy } from '@/util/text.js'
import BflexTooltip from '@/components/ui/BflexTooltip.vue'
import BflexIconText from '@/components/ui/BflexIconText.vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'choose',
    required: true,
    validator: value => ['choose', 'info', 'cancellation'].includes(value),
  },
  reservation: {
    type: Object,
    required: true,
  },
  payment: {
    type: Object,
    default: () => ({
      prepayment: '0.00',
      onArrival: '0.00',
    }),
  },
  summary: {
    type: Object,
    default: () => ({
      subtotal: '0.00',
      taxes: '0.00',
      fees: '0.00',
      discounts: '0.00',
      total: '0.00',
    }),
  },
  locale: {
    type: String,
    default: 'en',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const { t } = useI18n()
const emit = defineEmits(['changePaymentType', 'deleteAccommodationRequest'])

const { formatDescription } = useFormattedCancellationPolicy()

const onChangeActivePaymentType = (paymentType) => {
  emit('changePaymentType', paymentType)
}
const onDeleteAccommodation = (item) => {
  emit('deleteAccommodationRequest', {
    checkInDate: item.checkInDate,
    checkOutDate: item.checkOutDate,
    accommodationType: item.accommodationType.id,
    ratePlan: item.ratePlan.id,
    adults: item.adults,
    children: item.children,
    quantity: 0,
  })
}

const activePaymentTypes = ref({})
onMounted(() => {
  activePaymentTypes.value = props.reservation.paymentType.id
})
</script>

<template>
  <BflexSkeletonLoader v-if="loading" is-result></BflexSkeletonLoader>

  <BflexInformationBlock v-else class="accommodation-list">
    <BflexHeader>{{ t('chosenAccommodation.title') }}</BflexHeader>
    <BflexDivider></BflexDivider>

    <BflexContent>
        <dl class="text-sm">
          <dt>
            <BflexIconText icon="DateRange">{{
              formatDateRange(reservation.checkInDate, reservation.checkOutDate, locale)
            }}</BflexIconText>
          </dt>
          <dd>
            <BflexIconText icon="Persons">
              {{ t('chosenAccommodation.adults', reservation.adults) }},
              {{ t('chosenAccommodation.children', reservation.children.length) }}
            </BflexIconText>
          </dd>
        </dl>
      </BflexContent>
      <BflexDivider></BflexDivider>
      <BflexContent>
        <dl class="accommodation-list__item">
          <dt>
            <h3>
              {{ reservation.accommodationType.name }}
              <span style="font-size: 0.9em; opacity: 0.7" v-if="reservation.quantity > 1"
                >x{{ reservation.quantity }}</span
              >
            </h3>
            <div class="text-sm" style="line-height: 1.25; font-weight: lighter">
              {{ reservation.ratePlan.name }}<br />
              <BflexTooltip class="inline">
                <abbr>{{ reservation.cancellationPolicy.name || '' }}</abbr>
                <template #popper>
                  <p
                    v-for="(i, index) in formatDescription(reservation.cancellationPolicy.consequences)"
                    :key="index"
                  >
                    {{ i }}
                  </p>
                </template>
              </BflexTooltip>
            </div>
          </dt>
          <dd>
            <div
              v-if="mode === 'choose'"
              @click="() => onDeleteAccommodation(reservation)"
              class="accommodation-list__item-delete text-sm cursor-pointer"
            >
              {{ t('chosenAccommodation.delete') }}
            </div>
            <span style="opacity: 0.7" v-if="reservation.quantity > 1">{{ reservation.quantity }} x</span>
            {{ reservation.summary.total.amount }} {{ reservation.summary.total.currency }}
          </dd>
        </dl>
        <div v-if="mode === 'choose'" class="payment-type">
          <div class="payment-type__label">{{ t('chosenAccommodation.willPay') }}:</div>
          <div class="payment-type__variants">
            <label
              v-for="paymentType in reservation.availablePaymentTypes"
              :key="paymentType.id"
              :for="`payment-type-${index}-${reservation.ratePlan.id}-${paymentType.id}`"
            >
              <input
                type="radio"
                :name="`payment-type-${index}`"
                :id="`payment-type-${index}-${reservation.ratePlan.id}-${paymentType.id}`"
                :value="reservation.paymentType.id"
                :checked="+reservation.paymentType.id === +paymentType.id"
                @change="() => onChangeActivePaymentType(paymentType.id)"
              />
              {{ paymentType.name }}
            </label>
          </div>
        </div>
      </BflexContent>
      <BflexDivider></BflexDivider>

    <BflexContent>
      <dl class="accommodation-list__total">
        <dt>{{ t('chosenAccommodation.totalAmount') }}:</dt>
        <dd>
          <strong
            ><span>{{ summary.total.amount }}</span> {{ summary.total.currency }}</strong
          >
        </dd>
      </dl>
    </BflexContent>
    <BflexDivider></BflexDivider>
    <slot>
      <BflexContent>
        <dl class="accommodation-list__payment-rules">
            <dt class="highlighted">{{ t('chosenAccommodation.prepaymentAmount') }}:</dt>
            <dd class="highlighted">{{ payment.details.prepayment.amount }} {{ payment.details.prepayment.currency }}</dd>
            <dt>{{ t('chosenAccommodation.onArrivalAmount') }}:</dt>
            <dd>
              <span>{{ payment.details.onArrival.amount }}</span> {{ payment.details.onArrival.currency }}
            </dd>
        </dl>
      </BflexContent>
    </slot>
  </BflexInformationBlock>
</template>

<style lang="scss"></style>
