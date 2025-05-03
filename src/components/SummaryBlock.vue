<script setup>
import { defineProps, defineEmits } from 'vue'
import Button from './ui/Button.vue'
import Icon from '@/components/ui/Icon.vue'

defineProps({
  totalAmount: {
    type: String,
    default: '0',
  },
  lengthOfStay: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'EUR',
  },
  accommodationUnits: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['onAccommodationSummaryClick'])
</script>

<template>
  <div class="summary-block">
    <div class="summary-block__content">
      <div class="summary-block__content-info">
        <div class="summary-block__content-info__price">
          <span>{{ totalAmount }}</span> {{ currency }}
        </div>
        <div class="summary-block__content-info__text">
          {{ accommodationUnits }} номер, {{ lengthOfStay }} ночи
          <Icon @click.stop="emit('onAccommodationSummaryClick')" class="accommodation-summary-trigger" name="Info" small></Icon>
        </div>
      </div>
      <Button type="submit" variant="success" fill>
        Booking
        <Icon name="ArrowForward" style="margin-left: 0.5em" small></Icon>
      </Button>
    </div>
  </div>
</template>

<style lang="scss">
</style>
