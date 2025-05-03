<template>
  <div class="variant-line">
    <div class="variant-line__content">
      <div class="price-block">
        <div v-if="discount" class="price-block__discount">
          <span class="price-block__discount-size">
            <span>-{{ discount }}</span>
            <span class="price-block__percent">%</span>
          </span>
          <span class="price-block__old"
            ><span class="amount" v-html="formatMoney(originalSellingPrice, 'currency')"
          /></span>
        </div>

        <div class="price-block__amount">
          <div class="price-block__icons">
            <slot name="icons" />
          </div>
          <div class="price-block__separator"></div>
          <span v-if="sellingPrice" class="price-block__current">
            <span
              class="price-block__current-amount"
              v-html="formatMoney(sellingPrice, 'price-block__current-currency')"
            />
          </span>

          <span v-if="sellingPrice === 0">Free</span>

          <div v-if="sellingPrice && details" class="price-block__details" />
        </div>

        <div class="price-block__schedule">
          <slot name="schedule" />
        </div>
      </div>

      <slot />
    </div>

    <div class="variant-line__footer">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { htmlFormatMoney } from '../util/money.js'

const props = defineProps({
  sellingPrice: {
    type: String || null,
    default: null,
  },
  originalSellingPrice: {
    type: String || null,
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

const formatMoney = (money, className = '', showFraction = true) => {
  return htmlFormatMoney(money, props.currency, className, showFraction)
}
</script>

<style lang="scss">
</style>
