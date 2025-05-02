<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import Tooltip from './ui/Tooltip.vue'
import RatePlanVariant from './RatePlanVariant.vue'
import Loader from './ui/Loader.vue'
import { prepareText } from '../util/text.js'
import Icon from '@/components/ui/Icon.vue'

const props = defineProps({
  /**
   * @type {{
   *   name: string,
   *   description: string,
   *   cancellationPolicy: {
   *     name: string,
   *     description: string
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
  isBlocked: {
    type: Boolean,
    default: false,
  },
})

const prepareCancellationDescription = (description) => {
  if (!description || !Array.isArray(description)) {
    return ''
  }
  let text = []
  description.forEach((item) => {
    text.push(prepareText(item))
  })
  return text
}

const isDescriptionOpen = ref(false)

const hasFeedOffer = computed(() => props.data.feed?.name !== 'ROOM_ONLY')

const emit = defineEmits(['variant-chosen'])
const emitVariantChosen = (value) => {
  emit('variant-chosen', value)
}
</script>

<template>
  <div class="rate-plan-card">
    <div class="block" v-if="isBlocked">
      <Loader variant="pulse" color="red" center />
    </div>

    <div class="rate-plan-card__wrapper">
      <div class="rate-plan-card__description">
        <h3 @click="isDescriptionOpen = !isDescriptionOpen">
          {{ data.name }}
          <Icon :name="isDescriptionOpen ? 'ExpandLess' : 'ExpandMore'"></Icon>
        </h3>

        <div v-show="isDescriptionOpen" class="rate-plan-card__description-text">
          {{ data.description }}
        </div>

        <div class="rate-plan-card__offers">
          <div class="rate-plan-card__offers-item">
            <Icon name="Restore"></Icon>
            <span>
              <Tooltip class="more-details" trigger="touch">
                <span>{{ data.cancellationPolicy.name || '' }}</span>
                <template #popper>
                  <p
                    v-for="(item, index) in prepareCancellationDescription(
                      data.cancellationPolicy.description,
                    )"
                    :key="index"
                  >
                    {{ item }}
                  </p>
                </template>
              </Tooltip>
            </span>
          </div>

          <div
            v-if="data.feed"
            class="rate-plan-card__offers-item"
            :class="{ 'feed-offer': hasFeedOffer }"
            :title="data.feed.description"
          >
            <Icon name="Restaurant"></Icon>
            <span>{{ data.feed.name || '' }}</span>
          </div>

          <div class="rate-plan-card__offers-item">
            <Icon name="CreditCard"></Icon>
            <span
              ><strong style="margin-right: 5px">Payments:</strong>
              <template v-for="(paymentType, idx) in data.paymentTypes" :key="paymentType.name">
                <Tooltip class="more-details">
                  <span>{{ paymentType.name }}</span>
                  <template #popper>{{ paymentType.description }}</template>
                </Tooltip>
                <span v-if="data.paymentTypes.length - 1 !== idx" class="offers-item__separator"
                  >OR</span
                >
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
              <Icon name="Check">credit_card</Icon>
              <span>{{ extra.name }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="rate-plan-card__actions">
      <slot>
        <div class="variant-select__items">
          <span class="long-stay">{{ lengthOfStay }} ночи</span>
          <template v-for="(occupancyVariant, index) in data.variations || []" :key="index">
            <RatePlanVariant
              :occupancy-option="occupancyVariant.occupancyOptions"
              :price="occupancyVariant.price"
              @chosen="() => emitVariantChosen(occupancyVariant)"
            />
          </template>
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
@forward '../assets/css/rate-plan-card.scss';
</style>
