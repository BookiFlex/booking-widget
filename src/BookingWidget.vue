<script setup>
import { defineProps } from 'vue';
import { useBooking } from '@/composables/useBooking';
import BflexSkeletonLoader from '@/components/ui/BflexSkeletonLoader.vue';
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue';
import PageManager from '@/components/PageManager.vue';

const props = defineProps({
  start: {
    type: String,
    default: '',
  },
  end: {
    type: String,
    default: '',
  },
  promoCode: {
    type: String,
    default: null,
  },
  accommodationTypes: {
    type: Array,
    default: () => [],
  },
  ratePlans: {
    type: Array,
    default: () => [],
  },
});

const { activePage, loading, container } = useBooking(props);
</script>

<template>
  <main id="bflex-booking-widget">
    <div class="booking-widget">
      <section ref="container" class="booking-widget__content">
        <template v-if="loading">
          <BflexGridGap>
            <BflexSkeletonLoader v-for="i in 3" :key="i" />
          </BflexGridGap>
        </template>
        <PageManager v-else :active-page="activePage" />
      </section>
    </div>
  </main>
</template>

<style lang="scss">
@use './assets/css/index.scss';
</style>
