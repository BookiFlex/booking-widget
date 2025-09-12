<script setup>
import { computed } from 'vue';
import OffersPage from '@/pages/OffersPage.vue';
import ConfirmationPage from '@/pages/ConfirmationPage.vue';
import ResultPage from '@/pages/ResultPage.vue';
import CancellationPage from '@/pages/CancellationPage.vue';
import {
  CHOOSE_ACCOMMODATION,
  BOOKING_CONFIRMATION,
  RESERVATION_DETAILS,
  CANCEL_RESERVATION,
} from '@/constants.js';

const props = defineProps({
  activePage: {
    type: String,
    default: CHOOSE_ACCOMMODATION,
  },
});

const pages = {
  [CHOOSE_ACCOMMODATION]: OffersPage,
  [BOOKING_CONFIRMATION]: ConfirmationPage,
  [RESERVATION_DETAILS]: ResultPage,
  [CANCEL_RESERVATION]: CancellationPage,
};

const currentPage = computed(() => pages[props.activePage]);
</script>

<template>
  <component :is="currentPage" />
</template>
