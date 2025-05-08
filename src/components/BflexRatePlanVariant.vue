<script setup>
import BflexPriceBlock from './BflexPriceBlock.vue'

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
      <BflexPriceBlock :selling-price="price.sellingPrice"
                  :original-selling-price="price.originalSellingPrice"
                  :discount="price.discount || null"
                  :currency="price.currency">
        <template #icons>
          <slot name="icons" />
        </template>
      </BflexPriceBlock>

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
