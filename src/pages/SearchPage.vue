<script setup>
import { ref, defineEmits, defineProps, computed, watchEffect, onMounted } from 'vue'
import Skeleton from '../components/Skeleton/Skeleton.vue'
import { lengthOfStay as lengthOfStayFn } from '../util/date.js'
import { loadOffers } from '../api/api.js'
import AccommodationOfferBlock from '@/components/AccommodationOfferBlock.vue'
import InformationBlockGrid from '@/components/InformationBlock/InformationBlockGrid.vue'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const dateRange = ref({ start: null, end: null })
const promoCode = ref('')
const lengthOfStay = computed(() => {
  if (!dateRange.value.start || !dateRange.value.end) {
    return 0
  }
  return lengthOfStayFn(dateRange.value.start, dateRange.value.end)
})
const onSearchHandler = ({ start, end, promoCode: code }) => {
  dateRange.value = { start, end }
  promoCode.value = code
}

const accommodationOffers = ref([])
const loadingAccommodationOffers = ref(false)
watchEffect(async () => {
  if (!dateRange.value.start || !dateRange.value.end) {
    return
  }

  loadingAccommodationOffers.value = true
  const result = await loadOffers(dateRange.value.start, dateRange.value.end, promoCode.value)
  // const delayPromise = new Promise(resolve => setTimeout(resolve, 500));
  // await Promise.all([result, delayPromise]);

  accommodationOffers.value = result.searchResults
  loadingAccommodationOffers.value = false
})

const emit = defineEmits(['addToCart'])
const onAccommodationOfferChosen = ({ accommodationOffer, ratePlan, variant }) => {
  console.log('accommodationOfferChosen', accommodationOffer, ratePlan, variant)
  emit('addToCart', {
    checkInDate: dateRange.value.start,
    checkOutDate: dateRange.value.end,
    accommodationType: accommodationOffer.accommodationType.id,
    ratePlan: ratePlan.id,
    adults: variant.occupancyOptions.main + (variant.occupancyOptions.extraBed ? 1 : 0),
  })
}

onMounted(() => {
  // const searchBar = document.getElementById('searchBar');
  window.addEventListener('bflex:search', (e) => {
    console.log('bflex:search', e.detail[0])
    onSearchHandler(e.detail[0])
  })
})
</script>

<template>
  <InformationBlockGrid>
    <bflex-search-bar
      id="searchBar"
      style="position: sticky; top: 0; z-index: 999"
      :check-in-date="dateRange.start"
      :check-out-date="dateRange.end"
    ></bflex-search-bar>
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
