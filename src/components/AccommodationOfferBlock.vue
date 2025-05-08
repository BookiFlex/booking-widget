<script setup>
import { defineProps, defineEmits } from 'vue'
import InformationBlock from '@/components/InformationBlock/InformationBlock.vue'
import AccommodationTypeCard from '@/components/AccommodationTypeCard.vue'
import RatePlanCard from '@/components/RatePlanCard.vue'
import Divider from '@/components/InformationBlock/Divider.vue'

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
  <InformationBlock class="accommodation-offer">
    <AccommodationTypeCard :data="accommodationOffer.accommodationType"></AccommodationTypeCard>

    <div class="rate-plan-list__wrapper">
      <div class="rate-plan-list" :class="{'rate-plan-list--single': accommodationOffer.ratePlans.length <= 1}">
        <template v-for="ratePlan in accommodationOffer.ratePlans" :key="ratePlan.id">
          <Divider></Divider>
          <RatePlanCard
            :data="ratePlan"
            :length-of-stay="lengthOfStay"
            :disabled="loading"
            @variantChosen="(variant) => onVariantChosen(accommodationOffer, ratePlan, variant)"
          >
          </RatePlanCard>
        </template>
      </div>
    </div>
  </InformationBlock>
</template>

<style lang="scss"></style>
