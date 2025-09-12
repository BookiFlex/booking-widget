<script setup>
import { defineEmits, defineProps, computed, watch, inject } from 'vue'
import BflexSkeletonLoader from '../components/ui/BflexSkeletonLoader.vue'
import { lengthOfStay as lengthOfStayFn } from '../util/date.js'
import BflexAccommodationOfferCard from '@/components/BflexAccommodationOfferCard.vue'
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue'
import { CHOOSE_ACCOMMODATION } from '@/constants.js'
import { useOffers } from '@/composables/useOffers.js'
import { useCart } from '@/composables/useCart.js'

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

const emit = defineEmits(['released'])
const { setError } = inject('globalError')

const lengthOfStay = computed(() => {
  if (!props.dateRange.start || !props.dateRange.end) {
    return 0
  }
  return lengthOfStayFn(props.dateRange.start, props.dateRange.end)
})

// Используем composables
const { offers, loading: loadingOffers, loadOffers } = useOffers()
const { addToCart, loading: addingToCart } = useCart()

// Загружаем офферы при изменении дат
watch(
  () => props.dateRange,
  async (value) => {
    try {
      await loadOffers(value.start, value.end, props.promoCode)
    } catch (error) {
      setError(error)
    }
  },
  { deep: true, immediate: true }
)

const onAddToCart = async ({ accommodationOffer, ratePlan, variant }) => {
  try {
    const cart = await addToCart({
      type: 'accommodation',
      checkInDate: props.dateRange.start,
      checkOutDate: props.dateRange.end,
      accommodationTypeId: accommodationOffer.accommodationType.id,
      ratePlanId: ratePlan.id,
      adults: variant.occupancyOptions.main + variant.occupancyOptions.extraBed,
      children: [],
      quantity: 1,
    })
    emit('released', { action: CHOOSE_ACCOMMODATION, cart })
  } catch (error) {
    setError(error)
  }
}
</script>

<template>
  <BflexGridGap>
    <template v-if="loadingOffers">
      <BflexSkeletonLoader v-for="i in 3" :key="i"></BflexSkeletonLoader>
    </template>
    <template v-else>
      <BflexAccommodationOfferCard
        v-for="offer in offers"
        :accommodation-offer="offer"
        :length-of-stay="lengthOfStay"
        :loading="addingToCart"
        :key="offer.accommodationType.id"
        @accommodationOfferChosen="onAddToCart"
      ></BflexAccommodationOfferCard>
    </template>
  </BflexGridGap>
</template>
