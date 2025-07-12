<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import BflexIcon from '@/components/ui/BflexIcon.vue'

defineProps({
  prepayment: {
    type: String,
    default: '0',
  },
  currency: {
    type: String,
    default: 'EUR',
  },
})
const { t } = useI18n()

const emit = defineEmits(['click'])
const onActionClick = () => emit('click')
</script>

<template>
  <div class="summary-block">
    <div class="summary-block__content">
      <div class="summary-block__content-info">
        <div class="summary-block__content-info__price">
          <span>{{ prepayment }}</span> {{ currency }}
        </div>
        <div class="summary-block__content-info__text">
          {{ t('reservation.payment.prepayment') }}
          <BflexIcon class="accommodation-summary-trigger" name="Info" small></BflexIcon>
        </div>
      </div>
      <button class="button" @click.stop="onActionClick">
        {{ t('reservation.payment.action') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss"></style>
