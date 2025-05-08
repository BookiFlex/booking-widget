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
  dummy: {
    type: Boolean,
    default: false,
  },
  currency: {
    type: String,
    default: 'EUR',
  },
  locale: {
    type: String,
    default: 'en',
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
  items: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  }
})
const { t } = useI18n()
const emit = defineEmits(['changePaymentType', 'deleteAccommodationRequest'])

const { formatDescription } = useFormattedCancellationPolicy()

const onChangeActivePaymentType = (request, paymentType) => {
  emit('changePaymentType', { request, paymentType })
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
  Object.keys(props.items).forEach((id) => {
    activePaymentTypes.value[id] = props.items[id].paymentType.id
  })
})
</script>

<template>
  <BflexSkeletonLoader v-if="loading" is-result></BflexSkeletonLoader>

  <BflexInformationBlock v-else class="accommodation-list">
    <BflexHeader>{{ t('chosenAccommodation.title') }}</BflexHeader>
    <BflexDivider></BflexDivider>

    <template v-for="(item, id, index) in items" :key="index">
      <BflexContent>
        <dl class="text-sm">
          <dt>
            <BflexIconText icon="DateRange">{{
                formatDateRange(item.checkInDate, item.checkOutDate, locale)
              }}</BflexIconText>
          </dt>
          <dd>
            <BflexIconText icon="Persons">
              {{ t('chosenAccommodation.adults', item.adults) }}, {{ t('chosenAccommodation.children', item.children.length) }}
            </BflexIconText>
          </dd>
        </dl>
      </BflexContent>
      <BflexDivider></BflexDivider>
      <BflexContent>
        <dl class="accommodation-list__item">
          <dt>
            <h3>
              {{ item.accommodationType.name }}
              <span style="font-size: 0.9em; opacity: 0.7" v-if="item.quantity > 1"
                >x{{ item.quantity }}</span
              >
            </h3>
            <div class="text-sm" style="line-height: 1.25; font-weight: lighter">{{ item.ratePlan.name }}<br />
              <BflexTooltip class="inline">
                <abbr>{{ item.cancellationPolicy.name || '' }}</abbr>
                <template #popper>
                  <p
                    v-for="(i, index) in formatDescription(
                      item.cancellationPolicy.consequences,
                    )"
                    :key="index"
                  >
                    {{ i }}
                  </p>
                </template>
              </BflexTooltip></div>
          </dt>
          <dd>
            <div
              v-if="!dummy"
              @click="() => onDeleteAccommodation(item)"
              class="accommodation-list__item-delete text-sm cursor-pointer"
            >{{ t('chosenAccommodation.delete') }}</div
            >
            <span style="opacity: 0.7" v-if="item.quantity > 1">{{ item.quantity }} x</span>
            {{ item.summary.total }} {{ currency }}
          </dd>
        </dl>
        <div v-if="!dummy" class="payment-type">
          <div class="payment-type__label">{{ t('chosenAccommodation.willPay') }}:</div>
          <div class="payment-type__variants">
            <label
              v-for="paymentType in item.availablePaymentTypes"
              :key="paymentType.id"
              :for="`payment-type-${index}-${item.ratePlan.id}-${paymentType.id}`"
            >
              <input
                type="radio"
                :name="`payment-type-${index}`"
                :id="`payment-type-${index}-${item.ratePlan.id}-${paymentType.id}`"
                :value="activePaymentTypes[id]"
                :checked="+activePaymentTypes[id] === +paymentType.id"
                @change="() => onChangeActivePaymentType(id, paymentType.id)"
              />
              {{ paymentType.name }}
            </label>
          </div>
        </div>
      </BflexContent>
      <BflexDivider></BflexDivider>
    </template>

    <BflexContent>
      <dl class="accommodation-list__total">
        <dt>{{ t('chosenAccommodation.totalAmount') }}:</dt>
        <dd>
          <strong
            ><span>{{ summary.total }}</span> {{ currency }}</strong
          >
        </dd>
      </dl>
    </BflexContent>
    <BflexDivider></BflexDivider>
    <BflexContent>
      <dl class="accommodation-list__payment-rules">
        <dt style="color: orangered">{{ t('chosenAccommodation.prepaymentAmount') }}:</dt>
        <dd style="color: orangered">{{ payment.prepayment }} {{ currency }}</dd>
        <dt>{{ t('chosenAccommodation.onArrivalAmount') }}:</dt>
        <dd>
          <span>{{ payment.onArrival }}</span> {{ currency }}
        </dd>
      </dl>
    </BflexContent>
  </BflexInformationBlock>
</template>

<style lang="scss">
</style>
