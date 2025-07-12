<script setup>
import { defineProps, defineEmits } from 'vue'
import BflexInformationBlock from '@/components/InformationBlock/BflexInformationBlock.vue'
import BflexAccommodationTypeItem from '@/components/BflexAccommodationTypeItem.vue'
import BflexRatePlanItem from '@/components/BflexRatePlanItem.vue'
import BflexDivider from '@/components/InformationBlock/BflexDivider.vue'
import BflexContent from '@/components/InformationBlock/BflexContent.vue'
import { useI18n } from 'vue-i18n'

defineProps({
  accommodationOffer: { type: Object, required: true },
  lengthOfStay: { type: Number, required: true },
  loading: { type: Boolean, default: false },
})

const { t } = useI18n()
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
              <strong>{{ t('accommodationType.notAvailable.title') }}</strong
              ><br />{{ t('accommodationType.notAvailable.description') }}
            </p>
          </BflexContent>
        </template>
      </div>
    </div>
  </BflexInformationBlock>
</template>

<style lang="scss"></style>
