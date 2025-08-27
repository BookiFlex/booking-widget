<script setup>
import { defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import BflexIcon from '@/components/ui/BflexIcon.vue'
import { formatMoney } from '../util/money.js'

defineProps({
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
})
const { t } = useI18n()

const emit = defineEmits(['onAccommodationSummaryClick'])
</script>

<template>
  <div class="summary-block">
    <div class="summary-block__content">
      <div class="summary-block__content-info">
        <div class="summary-block__content-info__price">
          <span>{{ formatMoney(totals.total, totals.currency) }}</span>
        </div>
        <div class="summary-block__content-info__text">
          {{ t('summary.room', accommodationUnits) }}, {{ t('summary.los', lengthOfStay) }}
          <BflexIcon
            @click.stop="emit('onAccommodationSummaryClick')"
            class="accommodation-summary-trigger"
            name="Info"
            small
          ></BflexIcon>
        </div>
      </div>
      <button class="button" type="submit">
        {{ t('summary.complete') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss"></style>
