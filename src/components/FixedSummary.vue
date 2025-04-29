<script setup>
import { defineProps, defineEmits } from "vue";
import VsButton from "@vuesimple/vs-button";

defineProps({
  totalAmount: {
    type: String,
    default: '0'
  },
  lengthOfStay: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'EUR'
  },
  accommodationUnits: {
    type: Number,
    default: 0
  },
});

const emit = defineEmits(['onAccommodationSummaryClick']);
</script>

<template>
  <div class="summary-block">
    <div class="summary-block__content">
      <div class="summary-block__content-info">
        <div class="summary-block__content-info__price"><span>{{ totalAmount }}</span> {{ currency }}</div>
        <div class="summary-block__content-info__text"> {{ accommodationUnits }} номер, {{ lengthOfStay }} ночи <span @click.stop="emit('onAccommodationSummaryClick')" class="accommodation-summary-trigger material-icons small">info</span></div>
      </div>
      <vs-button type="submit" variant="success" fill>
        Booking
        <small class="material-icons small" style="margin-left: .5em">arrow_forward</small>
      </vs-button>
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/css/fixed-summary.scss";
</style>
