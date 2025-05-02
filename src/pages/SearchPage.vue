<script setup>
import { ref, defineEmits, defineProps, computed, watch } from 'vue'
import Skeleton from '../components/Skeleton/Skeleton.vue'
import { lengthOfStay as lengthOfStayFn } from '../util/date.js'
import { loadOffers } from '../api/api.js'
import AccommodationOfferBlock from '@/components/AccommodationOfferBlock.vue'
import InformationBlockGrid from '@/components/InformationBlock/InformationBlockGrid.vue'

const props = defineProps({
  dateRange: {
    type: Object,
    default: () => ({
      start: null,
      end: null,
    }),
  },
  promoCode: {
    type: String,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const lengthOfStay = computed(() => {
  if (!props.dateRange.start || !props.dateRange.end) {
    return 0
  }
  return lengthOfStayFn(props.dateRange.start, props.dateRange.end)
})

const accommodationOffers = ref([])
const loadingAccommodationOffers = ref(false)

watch(() => props.dateRange, async (value) => {
  if (!value.start || !value.end) {
    return
  }

  loadingAccommodationOffers.value = true
  const result = await loadOffers(value.start, value.end, props.promoCode)

  accommodationOffers.value = result.searchResults
  loadingAccommodationOffers.value = false
}, {
  deep: true,
  immediate: true,
})

const emit = defineEmits(['addToCart'])
const onAccommodationOfferChosen = ({ accommodationOffer, ratePlan, variant }) => {
  emit('addToCart', {
    checkInDate: props.dateRange.start,
    checkOutDate: props.dateRange.end,
    accommodationType: accommodationOffer.accommodationType.id,
    ratePlan: ratePlan.id,
    adults: variant.occupancyOptions.main + (variant.occupancyOptions.extraBed ? 1 : 0),
  })
}
</script>

<template>
  <InformationBlockGrid>
    <template v-if="loading || loadingAccommodationOffers">
      <Skeleton v-for="i in 3" :key="i"></Skeleton>
    </template>
    <template v-else>
      <AccommodationOfferBlock
        v-for="accommodationOffer in accommodationOffers"
        :accommodation-offer="accommodationOffer"
        :length-of-stay="lengthOfStay"
        :key="accommodationOffer.accommodationType.id"
        @accommodationOfferChosen="onAccommodationOfferChosen"
      ></AccommodationOfferBlock>
    </template>
  </InformationBlockGrid>
</template>

<style lang="scss">
</style>
