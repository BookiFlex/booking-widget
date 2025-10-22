<script setup>
import { computed, defineProps } from 'vue'
import { formatMoney } from '../util/money.js'

const props = defineProps({
  sellingPrice: {
    type: Number || null,
    default: null,
  },
  originalSellingPrice: {
    type: Number || null,
    default: null,
  },
  discount: {
    type: String || null,
    default: null,
  },
  currency: {
    type: String,
    required: true,
  },
  details: {
    type: String || null,
    default: null,
    required: false,
  },
})

const t = {
  free: window.wp.i18n.__('Free', 'bookiflex')
}

const originalPrice = computed(() => {
  // return formatMoney(props.originalSellingPrice, 'currency')
  return formatMoney(props.originalSellingPrice, props.currency)
})

const price = computed(() => {
  // return formatMoney(props.sellingPrice, 'price-block__current-currency')
  return formatMoney(props.sellingPrice, props.currency)
})
</script>

<template>
  <div class="price-block">
    <div v-if="discount" class="price-block__discount">
      <span class="price-block__discount-size">
        <span>-{{ discount }}</span>
        <span class="price-block__percent">%</span>
      </span>
      <span class="price-block__old">
        <span class="amount" v-html="originalPrice"></span>
      </span>
    </div>

    <div class="price-block__amount">
      <div class="price-block__icons">
        <slot name="icons" />
      </div>
      <span v-if="sellingPrice" class="price-block__current">
        <span class="price-block__current-amount" v-html="price"></span>
      </span>
      <span v-else-if="sellingPrice === 0">{{ t.free }}</span>
      <div v-if="sellingPrice && details" class="price-block__details" />
    </div>

    <div class="price-block__schedule">
      <slot name="schedule" />
    </div>
  </div>
</template>

<style lang="scss"></style>
