<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import BflexIcon from '@/components/ui/BflexIcon.vue'
import { formatMoney } from '../util/money.js'
import BflexButton from '@/components/ui/BflexButton.vue'

const props = defineProps({
  totals: {
    type: Object,
    required: true,
  },
  lengthOfStay: {
    type: Number,
    default: 0,
  },
  accommodationUnits: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  }
})

const t = {
  room: window.wp.i18n.__('%d room(s)', 'bookiflex'),
  los: window.wp.i18n.__('%d night(s)', 'bookiflex'),
  complete: window.wp.i18n.__('Complete Booking', 'bookiflex')
}

const summaryText = computed(() =>
  `${window.wp.i18n.sprintf(t.room, props.accommodationUnits)}, ${window.wp.i18n.sprintf(t.los, props.lengthOfStay)}`
)

const emit = defineEmits(['onAccommodationSummaryClick', 'submit'])
</script>

<template>
  <div class="summary-block">
    <div class="summary-block__content">
      <div class="summary-block__content-info">
        <div class="summary-block__content-info__price">
          <span>{{ formatMoney(totals.total, totals.currency) }}</span>
        </div>
        <div class="summary-block__content-info__text">
          {{ summaryText }}
          <BflexIcon
            @click.stop="emit('onAccommodationSummaryClick')"
            class="accommodation-summary-trigger"
            name="Info"
            small
          ></BflexIcon>
        </div>
      </div>
      <BflexButton :loading="loading" @click="() => emit('submit')">{{ t.complete }}</BflexButton>
<!--      <button class="button" type="submit"></button>-->
    </div>
  </div>
</template>

<style lang="scss"></style>
