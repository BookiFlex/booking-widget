<script setup>
import { defineProps, defineEmits } from 'vue'
import BflexInformationBlock from '@/components/InformationBlock/BflexInformationBlock.vue'
import BflexAccommodationTypeItem from '@/components/BflexAccommodationTypeItem.vue'
import BflexRatePlanItem from '@/components/BflexRatePlanItem.vue'
import BflexDivider from '@/components/InformationBlock/BflexDivider.vue'
import BflexContent from '@/components/InformationBlock/BflexContent.vue'

defineProps({
  accommodationOffer: { type: Object, required: true },
  lengthOfStay: { type: Number, required: true },
  loading: { type: Boolean, default: false },
})

const t = {
  notAvailableTitle: window.wp.i18n.__('Not Available', 'bookiflex'),
  notAvailableDescription: window.wp.i18n.__('This accommodation type is not available for the selected dates', 'bookiflex')
}

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
    <BflexAccommodationTypeItem
      :data="accommodationOffer.accommodationType"
      :room-quantity="accommodationOffer.roomQuantity"
    ></BflexAccommodationTypeItem>

    <div class="rate-plan-list__wrapper">
      <div
        class="rate-plan-list"
        :class="{ 'rate-plan-list--single': accommodationOffer.ratePlans.length <= 1 }"
      >
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
        <template v-if="!accommodationOffer.ratePlans.length">
          <BflexDivider></BflexDivider>
          <BflexContent>
            <p>
              <strong>{{ t.notAvailableTitle }}</strong
              ><br />{{ t.notAvailableDescription }}
            </p>
          </BflexContent>
        </template>
      </div>
    </div>
  </BflexInformationBlock>
</template>

<style lang="scss"></style>
