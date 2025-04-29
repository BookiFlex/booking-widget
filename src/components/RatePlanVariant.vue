<script setup>
import PriceBlock from "./PriceBlock.vue";
import ScenarioIcon from "./ScenarioIcon.vue";
import VsButton from "@vuesimple/vs-button";

const emit = defineEmits(["chosen"]);

defineProps({
  /**
   * @type {{
   *   kind: string,
   *   main: number,
   *   extraBed: boolean
   * }}
   */
  occupancyOption: {
    type: Object,
    required: true,
  },
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
});

const onBookClick = () => emit("chosen");
</script>

<template>
  <div class="variant-option">
    <PriceBlock
        :selling-price="price.sellingPrice"
        :original-selling-price="price.originalSellingPrice"
        :discount="price.discount || null"
        :currency="price.currency"
    >
      <template #icons>
        <ScenarioIcon
            :kind="occupancyOption.kind"
            :main="occupancyOption.main"
            :extra-bed="occupancyOption.extraBed"
        />
      </template>

      <template #default>
        <div class="variant-option__book">
          <VsButton @click="onBookClick" variant="success" fill>
            Book now
          </VsButton>
        </div>
      </template>
    </PriceBlock>
  </div>
</template>

<style lang="scss">

</style>
