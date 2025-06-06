<script setup>
import { ref, defineEmits, defineProps, computed, watch, inject } from 'vue'
import BflexSkeletonLoader from '../components/ui/BflexSkeletonLoader.vue'
import { lengthOfStay as lengthOfStayFn } from '../util/date.js'
import { loadOffers, updateCart } from '../api/api.js'
import BflexAccommodationOfferCard from '@/components/BflexAccommodationOfferCard.vue'
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue'
import { CHOOSE_ACCOMMODATION } from '@/constants.js'

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
})

const lengthOfStay = computed(() => {
  if (!props.dateRange.start || !props.dateRange.end) {
    return 0
  }
  return lengthOfStayFn(props.dateRange.start, props.dateRange.end)
})

const accommodationOffers = ref([])
const loadingAccommodationOffers = ref(false)
const { setError } = inject('globalError')

watch(
  () => props.dateRange,
  async (value) => {
    if (!value.start || !value.end) {
      return
    }

    loadingAccommodationOffers.value = true
    try {
      const result = await loadOffers(value.start, value.end, props.promoCode)
      accommodationOffers.value = moveEmptyRatePlansToBottom(result.searchResults)
    } catch (error) {
      setError(error)
    } finally {
      loadingAccommodationOffers.value = false
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

function moveEmptyRatePlansToBottom(items) {
  return [
    ...items.filter(item => item.ratePlans && item.ratePlans.length > 0),
    ...items.filter(item => !item.ratePlans || item.ratePlans.length === 0)
  ];
}

const emit = defineEmits(['released'])

const addingToCart = ref(false)
const onAddToCart = async ({ accommodationOffer, ratePlan, variant }) => {
  addingToCart.value = true

  try {
    const result = await updateCart({
      checkInDate: props.dateRange.start,
      checkOutDate: props.dateRange.end,
      accommodationType: accommodationOffer.accommodationType.id,
      ratePlan: ratePlan.id,
      adults: variant.occupancyOptions.main + variant.occupancyOptions.extraBed,
      children: [],
      quantity: 1,
    })
    emit('released', { action: CHOOSE_ACCOMMODATION, cart: result.cart })
  } catch (error) {
    setError(error)
  } finally {
    addingToCart.value = false
  }
}
</script>

<template>
  <BflexGridGap>
    <template v-if="loadingAccommodationOffers">
      <BflexSkeletonLoader v-for="i in 3" :key="i"></BflexSkeletonLoader>
    </template>
    <template v-else>
      <BflexAccommodationOfferCard
        v-for="accommodationOffer in accommodationOffers"
        :accommodation-offer="accommodationOffer"
        :length-of-stay="lengthOfStay"
        :loading="addingToCart"
        :key="accommodationOffer.accommodationType.id"
        @accommodationOfferChosen="onAddToCart"
      ></BflexAccommodationOfferCard>
    </template>
  </BflexGridGap>
</template>

<style lang="scss"></style>
