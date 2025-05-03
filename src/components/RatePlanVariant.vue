<script setup>
import PriceBlock from './PriceBlock.vue'

defineProps({
  /**
   * @type {{
   *   currency: string,
   *   sellingPrice: string,
   *   originalSellingPrice: string,
   *   discount: string,
   *   details: {
   *     subtotal: string,
   *     taxes: string,
   *     charges: string,
   *     discounts: string
   *   }
   * }}
   */
  price: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="variant-line">
    <div class="variant-line__content">
      <PriceBlock :selling-price="price.sellingPrice"
                  :original-selling-price="price.originalSellingPrice"
                  :discount="price.discount || null"
                  :currency="price.currency">
        <template #icons>
          <slot name="icons" />
        </template>
      </PriceBlock>

      <div class="variant-line__actions">
        <slot />
      </div>
    </div>

    <div class="variant-line__footer">
      <slot name="action" />
    </div>
  </div>
</template>

<style lang="scss">
</style>
