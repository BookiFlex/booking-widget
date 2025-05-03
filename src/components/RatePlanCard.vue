<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import Tooltip from './ui/Tooltip.vue'
import RatePlanVariant from './RatePlanVariant.vue'
import Loader from './ui/Loader.vue'
import { prepareText } from '../util/text.js'
import Icon from '@/components/ui/Icon.vue'
import ScenarioIcon from '@/components/ScenarioIcon.vue'
import Button from '@/components/ui/Button.vue'

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
    <div class="rate-plan-card--blocked" v-if="isBlocked">
      <Loader variant="pulse" color="red" center />
    </div>

    <div class="rate-plan-card__wrapper">
      <div class="rate-plan-card__description">
        <h2 @click="isDescriptionOpen = !isDescriptionOpen" class="cursor-pointer">
          {{ data.name }}
          <Icon :name="isDescriptionOpen ? 'ExpandLess' : 'ExpandMore'"></Icon>
        </h2>

        <blockquote v-show="isDescriptionOpen">
          {{ data.description }}
        </blockquote>

        <div class="rate-plan-card__offers">
          <div class="rate-plan-card__offers-item">
            <Icon name="Restore"></Icon>
            <Tooltip class="inline" trigger="touch">
                <abbr>{{ data.cancellationPolicy.name || '' }}</abbr>
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
              ><strong style="margin-right: .375rem">Payments:</strong>
              <template v-for="(paymentType, idx) in data.paymentTypes" :key="paymentType.name">
                <Tooltip class="inline">
                  <abbr>{{ paymentType.name }}</abbr>
                  <template #popper>{{ paymentType.description }}</template>
                </Tooltip>
                <strong v-if="data.paymentTypes.length - 1 !== idx" style="margin: 0 .375rem">OR</strong>
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
        <div class="rate-plan-card__variants">
          <span class="length-of-stay">{{ lengthOfStay }} ночи</span>
          <template v-for="(occupancyVariant, index) in data.variations || []" :key="index">
            <RatePlanVariant :price="occupancyVariant.price">
              <template #icons>
                <ScenarioIcon
                  :kind="occupancyVariant.occupancyOptions.kind"
                  :main="occupancyVariant.occupancyOptions.main"
                  :extra-bed="occupancyVariant.occupancyOptions.extraBed"
                />
              </template>

              <Button @click="() => emitVariantChosen(occupancyVariant)" variant="success" fill> Book now </Button>
            </RatePlanVariant>
          </template>
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
</style>
