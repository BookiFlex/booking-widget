<script setup>
import { computed, defineProps } from 'vue';
import BflexSkeletonLoader from '../components/ui/BflexSkeletonLoader.vue';
import { lengthOfStay as lengthOfStayFn } from '../util/date.js';
import BflexAccommodationOfferCard from '@/components/BflexAccommodationOfferCard.vue';
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue';
import { useBooking } from '@/composables/useBooking';

const props = defineProps({
  // The component receives props from the parent, but they are not used directly.
  // The `useBooking` composable provides the necessary state.
});

const { searchParams, accommodationOffers, loadingAccommodationOffers, addingToCart, onAddToCart } = useBooking(props);
const lengthOfStay = computed(() => {
  if (!searchParams.value.start || !searchParams.value.end) {
    return 0;
  }
  return lengthOfStayFn(searchParams.value.start, searchParams.value.end);
});
</script>

<template>
  <BflexGridGap>
    <template v-if="loadingAccommodationOffers">
      <BflexSkeletonLoader v-for="i in 3" :key="i" />
    </template>
    <template v-else>
      <BflexAccommodationOfferCard
        v-for="accommodationOffer in accommodationOffers"
        :key="accommodationOffer.accommodationType.id"
        :accommodation-offer="accommodationOffer"
        :length-of-stay="lengthOfStay"
        :loading="addingToCart"
        @accommodationOfferChosen="onAddToCart"
      />
    </template>
  </BflexGridGap>
</template>

<style lang="scss"></style>
