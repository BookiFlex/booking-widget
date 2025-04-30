<script setup>
import { defineProps, ref, onMounted, defineEmits } from 'vue'
import { formatDateRange } from '../util/date.js'
import Divider from './InformationBlock/Divider.vue'
import Content from './InformationBlock/Content.vue'
import InformationBlock from './InformationBlock/InformationBlock.vue'
import Header from './InformationBlock/Header.vue'
import MaterialIcon from '@/components/ui/MaterialIcon.vue'
import Skeleton from '@/components/Skeleton/Skeleton.vue'

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
const emit = defineEmits(['changePaymentType', 'deleteAccommodationRequest'])

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

  <InformationBlock v-else>
    <slot>
      <Header>Accommodations</Header>
    </slot>
    <Divider></Divider>

    <template v-for="(item, id, index) in items" :key="index">
      <Content>
        <dl class="accommodation-list__items">
          <dt>
            <span class="icon-text">
              <MaterialIcon class="icon-text__icon">event</MaterialIcon>
              <span class="icon-text__text">{{
                formatDateRange(item.checkInDate, item.checkOutDate, 'ru-RU')
              }}</span>
            </span>
          </dt>
          <dd>
            <span class="icon-text">
              <MaterialIcon class="icon-text__icon">persons</MaterialIcon>
              <span class="icon-text__text"
                >{{ item.adults }} взрослых, {{ item.children.length }} ребенок</span
              >
            </span>
          </dd>
        </dl>
      </Content>
      <Divider></Divider>
      <Content>
        <dl class="accommodation-list__items">
          <dt class="accommodation-description">
            <div class="accommodation-type">
              {{ item.accommodationType.name }}
              <span style="font-size: 0.9em; opacity: 0.7" v-if="item.quantity > 1"
                >x{{ item.quantity }}</span
              >
              <small
                v-if="!dummy"
                @click="() => onDeleteAccommodation(item)"
                style="font-weight: normal; opacity: 0.6"
                >delete</small
              >
            </div>
            <div class="rate-plan">{{ item.ratePlan.name }}</div>
            <div class="cancellation-policy">{{ item.cancellationPolicy.name }}</div>
          </dt>
          <dd>
            <span style="opacity: 0.7" v-if="item.quantity > 1">{{ item.quantity }} x</span>
            {{ item.summary.total }} {{ currency }}
          </dd>
        </dl>
        <div v-if="!dummy" class="payment-type">
          <div class="payment-type__label">Буду оплачивать:</div>
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
      <dl class="accommodation-list__items">
        <dt>Общая стоимость</dt>
        <dd>
          <strong
            ><span>{{ summary.total }}</span> {{ currency }}</strong
          >
        </dd>
      </dl>
    </Content>
    <Divider></Divider>
    <Content>
      <dl class="accommodation-list__items">
        <dt style="color: orangered">Предоплата:</dt>
        <dd style="color: orangered">{{ payment.prepayment }} {{ currency }}</dd>
        <dt>К оплате на месте:</dt>
        <dd>
          <span>{{ payment.onArrival }}</span> {{ currency }}
        </dd>
      </dl>
    </Content>
  </InformationBlock>
</template>

<style lang="scss">
@forward '../assets/css/accommodation-card.scss';
</style>
