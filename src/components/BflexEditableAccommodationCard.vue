<script setup>
import { defineProps, ref, onMounted, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDateRange } from '../util/date.js'
import BflexDivider from './InformationBlock/BflexDivider.vue'
import BflexContent from './InformationBlock/BflexContent.vue'
import BflexInformationBlock from './InformationBlock/BflexInformationBlock.vue'
import BflexHeader from './InformationBlock/BflexHeader.vue'
import BflexTooltip from '@/components/ui/BflexTooltip.vue'
import BflexIconText from '@/components/ui/BflexIconText.vue'
import { formatMoney } from '../util/money.js'
import { useCancellationI18n } from '@/composables/index.js'

const props = defineProps({
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
  totals: {
    type: Object,
    default: () => ({
      currency: 'EUR',
      subtotal: 0,
      total: 0,
      summary: {
        base: 0,
        taxes: 0,
        charges: 0,
        discounts: 0
      },
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
const emit = defineEmits(['changePaymentType', 'deleteAccommodation'])

const { formatRuleDescription } = useCancellationI18n()

const onChangeActivePaymentType = (paymentType) => {
  emit('changePaymentType', paymentType)
}

const onDeleteAccommodation = () => {
  emit('deleteAccommodation', props.reservation.hash)
}

const activePaymentTypes = ref({})
onMounted(() => {
  activePaymentTypes.value = props.reservation.details.accommodation.paymentType.id
})
</script>

<template>
  <BflexInformationBlock class="accommodation-list">
    <BflexHeader>{{ t('chosenAccommodation.title') }}</BflexHeader>
    <BflexDivider></BflexDivider>

    <BflexContent>
      <dl class="text-sm stay-information">
        <dt>
          <BflexIconText icon="DateRange">{{
              formatDateRange(reservation.details.accommodation.checkInDate, reservation.details.accommodation.checkOutDate, locale)
            }}</BflexIconText>
        </dt>
        <dd>
          <BflexIconText icon="Persons">
            {{ t('chosenAccommodation.adults', reservation.details.accommodation.adults) }},
            {{ t('chosenAccommodation.children', reservation.details.accommodation.children.length) }}
          </BflexIconText>
        </dd>
      </dl>
    </BflexContent>
    <BflexDivider></BflexDivider>

    <BflexContent>
      <dl class="accommodation-list__item">
        <dt>
          <h3>
            {{ reservation.name }}
            <span style="font-size: 0.9em; opacity: 0.7" v-if="reservation.quantity > 1"
            >x{{ reservation.quantity }}</span
            >
          </h3>
          <div class="text-sm" style="line-height: 1.25; font-weight: lighter">
            <BflexTooltip class="inline">
              <abbr>{{ reservation.details.accommodation.cancellationPolicy.name || '' }}</abbr>
              <template #popper>
                <p
                  v-for="(rule, index) in reservation.details.accommodation.cancellationPolicy.rules"
                  :key="index"
                >
                  {{ formatRuleDescription(rule) }}
                </p>
              </template>
            </BflexTooltip>
          </div>
        </dt>
        <dd>
          <div
            @click="onDeleteAccommodation"
            class="accommodation-list__item-delete text-sm cursor-pointer"
          >
            {{ t('chosenAccommodation.delete') }}
          </div>
          <span style="opacity: 0.7" v-if="reservation.quantity > 1"
          >{{ reservation.quantity }} x</span
          >
          {{ formatMoney(reservation.unitPrice, totals.currency) }}
        </dd>
      </dl>

      <div class="payment-type">
        <div class="payment-type__label">{{ t('chosenAccommodation.willPay') }}:</div>
        <div class="payment-type__variants">
          <label
            v-for="(paymentType, index) in reservation.details.availablePaymentTypes"
            :key="paymentType.id"
            :for="`payment-type-${index}-${reservation.details.accommodation.ratePlan.id}-${paymentType.id}`"
          >
            <input
              type="radio"
              :name="`payment-type-${index}`"
              :id="`payment-type-${index}-${reservation.details.accommodation.ratePlan.id}-${paymentType.id}`"
              :value="reservation.details.accommodation.paymentType.id"
              :checked="+reservation.details.accommodation.paymentType.id === +paymentType.id"
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
          <strong>{{ formatMoney(totals.total, totals.currency) }}</strong>
        </dd>
      </dl>
    </BflexContent>
    <BflexDivider></BflexDivider>

    <slot>
      <BflexContent>
        <dl class="accommodation-list__payment-rules">
          <dt class="highlighted">{{ t('chosenAccommodation.prepaymentAmount') }}:</dt>
          <dd class="highlighted">
            <span v-if="loading" class="amount-loader"></span>
            <span v-else>{{ formatMoney(payment.prepayment, totals.currency)  }}</span>
          </dd>
          <dt>{{ t('chosenAccommodation.onArrivalAmount') }}:</dt>
          <dd>
            <span v-if="loading" class="amount-loader"></span>
            <span v-else>{{ formatMoney(payment.onArrival || 0, totals.currency) }}</span>
          </dd>
        </dl>
      </BflexContent>
    </slot>
  </BflexInformationBlock>
</template>

<style lang="scss">

</style>
