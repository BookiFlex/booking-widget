<script setup>
import { defineProps, defineEmits } from 'vue'
import BflexInformationBlock from '@/components/InformationBlock/BflexInformationBlock.vue'
import BflexAccommodationTypeItem from '@/components/BflexAccommodationTypeItem.vue'
import BflexRatePlanItem from '@/components/BflexRatePlanItem.vue'
import BflexDivider from '@/components/InformationBlock/BflexDivider.vue'

defineProps({
  accommodationOffer: { type: Object, required: true },
  lengthOfStay: { type: Number, required: true },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['accommodationOfferChosen'])

const onVariantChosen = (accommodationOffer, ratePlan, variant) => {
  emit('accommodationOfferChosen', {
    accommodationOffer,
    ratePlan,
    variant,
  })
}
</script>

<template>
  <BflexInformationBlock class="accommodation-offer">
    <BflexAccommodationTypeItem :data="accommodationOffer.accommodationType"></BflexAccommodationTypeItem>

    <div class="rate-plan-list__wrapper">
      <div class="rate-plan-list" :class="{'rate-plan-list--single': accommodationOffer.ratePlans.length <= 1}">
        <template v-for="ratePlan in accommodationOffer.ratePlans" :key="ratePlan.id">
          <BflexDivider></BflexDivider>
          <BflexRatePlanItem
            :data="ratePlan"
            :length-of-stay="lengthOfStay"
            :disabled="loading"
            @variantChosen="(variant) => onVariantChosen(accommodationOffer, ratePlan, variant)"
          >
          </BflexRatePlanItem>
        </template>
      </div>
    </div>
  </BflexInformationBlock>
</template>

<style lang="scss"></style>
