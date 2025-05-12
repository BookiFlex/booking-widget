<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BflexTooltip from './ui/BflexTooltip.vue'
import BflexRatePlanVariantItem from './BflexRatePlanVariantItem.vue'
import { useFormattedCancellationPolicy } from '../util/text.js'
import BflexIcon from '@/components/ui/BflexIcon.vue'
import BflexScenarioIcon from '@/components/BflexScenarioIcon.vue'
import BflexButton from '@/components/ui/BflexButton.vue'

const props = defineProps({
  /**
   * @type {{
   *   name: string,
   *   description: string,
   *   cancellationPolicy: {
   *     name: string,
   *     consequences: string
   *   },
   *   paymentTypes: Array<{
   *     name: string,
   *     description: string
   *   }>,
   *   feed: {
   *     name: string,
   *   },
   *   variations: {
   *     occupancyOptions: {
   *       kind: string,
   *       main: number,
   *       extraBed: boolean
   *     },
   *     price: {
   *       currency: string,
   *       sellingPrice: string,
   *       originalSellingPrice: string,
   *       discount: string,
   *       details: {
   *         subtotal: string,
   *         taxes: string,
   *         charges: string,
   *         discounts: string
   *       }
   *     }
   *   },
   *   extras: Array<{
   *     name: string,
   *     icon: string,
   *     color: string
   *   }>,
   * }}
   */
  data: {
    type: Object,
    required: true,
  },
  lengthOfStay: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const { t } = useI18n()

const isDescriptionOpen = ref(false)
const loading = ref({})

const hasFeedOffer = computed(() => props.data.feed?.name !== 'ROOM_ONLY')

const emit = defineEmits(['variant-chosen'])
const emitVariantChosen = (value, index) => {
  if (loading.value[index]) {
    return
  }

  loading.value[index] = true
  emit('variant-chosen', value)
}

const { formatDescription } = useFormattedCancellationPolicy()
</script>

<template>
  <div class="rate-plan-card">
    <div class="rate-plan-card__wrapper">
      <div class="rate-plan-card__description">
        <h2
          @click="isDescriptionOpen = !isDescriptionOpen"
          class="rate-plan-card__title cursor-pointer"
        >
          {{ data.name }}
          <BflexIcon :name="isDescriptionOpen ? 'ExpandLess' : 'ExpandMore'"></BflexIcon>
        </h2>

        <blockquote v-show="isDescriptionOpen">
          {{ data.description }}
        </blockquote>

        <div class="rate-plan-card__offers">
          <div class="rate-plan-card__offers-item">
            <BflexIcon name="Restore"></BflexIcon>
            <BflexTooltip class="inline">
              <abbr>{{ data.cancellationPolicy.name || '' }}</abbr>
              <template #popper>
                <p
                  v-for="(item, index) in formatDescription(data.cancellationPolicy.consequences)"
                  :key="index"
                >
                  {{ item }}
                </p>
              </template>
            </BflexTooltip>
          </div>

          <div
            v-if="data.feed"
            class="rate-plan-card__offers-item"
            :class="{ 'feed-offer': hasFeedOffer }"
            :title="data.feed.description"
          >
            <BflexIcon name="Restaurant"></BflexIcon>
            <span>{{ data.feed.name ? t(`ratePlan.boardType.${data.feed.name}`) : '' }}</span>
          </div>

          <div class="rate-plan-card__offers-item">
            <BflexIcon name="CreditCard"></BflexIcon>
            <span
              ><strong style="margin-right: 0.375rem">{{ t('ratePlan.payments') }}:</strong>
              <template v-for="(paymentType, idx) in data.paymentTypes" :key="paymentType.name">
                <BflexTooltip class="inline">
                  <abbr>{{ paymentType.name }}</abbr>
                  <template #popper>{{ paymentType.description }}</template>
                </BflexTooltip>
                <strong v-if="data.paymentTypes.length - 1 !== idx" style="margin: 0 0.375rem">{{
                  t('ratePlan.or')
                }}</strong>
              </template>
            </span>
          </div>

          <template v-if="data.extras.length">
            <div
              v-for="(extra, extraIdx) in data.extras"
              :key="extraIdx"
              class="rate-plan-card__offers-item extra-offer"
              :style="{ color: extra.color }"
            >
              <BflexIcon name="Check">credit_card</BflexIcon>
              <span>{{ extra.name }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="rate-plan-card__actions">
      <slot>
        <div class="rate-plan-card__variants">
          <span class="length-of-stay">{{ t('ratePlan.los', lengthOfStay) }}</span>
          <template v-for="(occupancyVariant, index) in data.variations || []" :key="index">
            <BflexRatePlanVariantItem :price="occupancyVariant.price">
              <template #icons>
                <BflexScenarioIcon
                  :kind="occupancyVariant.occupancyOptions.kind"
                  :main="occupancyVariant.occupancyOptions.main"
                  :extra-bed="occupancyVariant.occupancyOptions.extraBed"
                />
              </template>

              <BflexButton
                :loading="loading[index]"
                :disabled="disabled && !loading[index]"
                @click="() => emitVariantChosen(occupancyVariant, index)"
                >{{ t('ratePlan.action') }}</BflexButton
              >
            </BflexRatePlanVariantItem>
          </template>
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss"></style>
