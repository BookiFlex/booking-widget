<script setup>
import { defineProps, ref, onMounted, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDateRange } from '../util/date.js'
import Divider from './InformationBlock/Divider.vue'
import Content from './InformationBlock/Content.vue'
import InformationBlock from './InformationBlock/InformationBlock.vue'
import Header from './InformationBlock/Header.vue'
import Skeleton from '@/components/Skeleton/Skeleton.vue'
import Icon from '@/components/ui/Icon.vue'
import { useFormattedCancellationPolicy } from '@/util/text.js'
import Tooltip from '@/components/ui/Tooltip.vue'

const props = defineProps({
  dummy: {
    type: Boolean,
    default: false,
  },
  currency: {
    type: String,
    default: 'EUR',
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
  <Skeleton v-if="loading" is-result></Skeleton>

  <InformationBlock v-else class="accommodation-list">
    <Header>{{ t('chosenAccommodation.title') }}</Header>
    <Divider></Divider>

    <template v-for="(item, id, index) in items" :key="index">
      <Content>
        <dl class="text-sm">
          <dt>
            <span class="icon-text">
              <Icon class="icon-text__icon" name="DateRange"></Icon>
              <span class="icon-text__text">{{
                formatDateRange(item.checkInDate, item.checkOutDate, 'ru-RU')
              }}</span>
            </span>
          </dt>
          <dd>
            <span class="icon-text">
              <Icon class="icon-text__icon" name="Persons"></Icon>
              <span class="icon-text__text"
                >{{ t('chosenAccommodation.adults', item.adults) }}, {{ t('chosenAccommodation.children', item.children.length) }}</span
              >
            </span>
          </dd>
        </dl>
      </Content>
      <Divider></Divider>
      <Content>
        <dl class="accommodation-list__item">
          <dt>
            <h3>
              {{ item.accommodationType.name }}
              <span style="font-size: 0.9em; opacity: 0.7" v-if="item.quantity > 1"
                >x{{ item.quantity }}</span
              >
            </h3>
            <div class="text-sm" style="line-height: 1.25; font-weight: lighter">{{ item.ratePlan.name }}<br />
              <Tooltip class="inline">
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
              </Tooltip></div>
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
                :checked="activePaymentTypes[id] == paymentType.id"
                @change="() => onChangeActivePaymentType(id, paymentType.id)"
              />
              {{ paymentType.name }}
            </label>
          </div>
        </div>
      </Content>
      <Divider></Divider>
    </template>

    <Content>
      <dl class="accommodation-list__total">
        <dt>{{ t('chosenAccommodation.totalAmount') }}:</dt>
        <dd>
          <strong
            ><span>{{ summary.total }}</span> {{ currency }}</strong
          >
        </dd>
      </dl>
    </Content>
    <Divider></Divider>
    <Content>
      <dl class="accommodation-list__payment-rules">
        <dt style="color: orangered">{{ t('chosenAccommodation.prepaymentAmount') }}:</dt>
        <dd style="color: orangered">{{ payment.prepayment }} {{ currency }}</dd>
        <dt>{{ t('chosenAccommodation.onArrivalAmount') }}:</dt>
        <dd>
          <span>{{ payment.onArrival }}</span> {{ currency }}
        </dd>
      </dl>
    </Content>
  </InformationBlock>
</template>

<style lang="scss">
</style>
