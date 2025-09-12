<script setup>
import { ref, defineProps, defineEmits, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import BflexTooltip from './ui/BflexTooltip.vue'
import BflexRatePlanVariantItem from './BflexRatePlanVariantItem.vue'
import BflexIcon from '@/components/ui/BflexIcon.vue'
import BflexScenarioIcon from '@/components/BflexScenarioIcon.vue'
import BflexButton from '@/components/ui/BflexButton.vue'
import { useCancellationI18n } from '@/composables/index.js'
import { formatMoney } from '../util/money.js'

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
   *       extraBed: number
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
  additionalFees: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const { t } = useI18n()
const { formatRuleDescription } = useCancellationI18n()

const isDescriptionOpen = ref(false)
const loading = ref({})
const selectedVariantIndex = ref(null)
const isVariantSelectorOpen = ref(false)

const hasFeedOffer = computed(() => props.data.feed?.name !== 'ROOM_ONLY')

// Вычисляемое свойство для текущего выбранного варианта
const selectedVariant = computed(() => {
  if (selectedVariantIndex.value !== null && props.data.variations) {
    return props.data.variations[selectedVariantIndex.value]
  }
  return null
})

// Обработчики для мобильной версии
const selectVariant = (index) => {
  selectedVariantIndex.value = index
  isVariantSelectorOpen.value = false
}

const toggleVariantSelector = () => {
  if (!props.disabled) {
    isVariantSelectorOpen.value = !isVariantSelectorOpen.value
  }
}

// Закрытие селектора при клике вне его
const handleClickOutside = (event) => {
  const selector = event.target.closest('.variant-selector')
  if (!selector) {
    isVariantSelectorOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const emit = defineEmits(['variant-chosen'])

// Обработчик для десктопной версии (оставляем как было)
const emitVariantChosen = (value, index) => {
  if (loading.value[index]) {
    return
  }
  loading.value[index] = true
  emit('variant-chosen', value)
}

// Обработчик для мобильной версии (одна кнопка)
const emitMobileVariantChosen = () => {
  if (selectedVariantIndex.value === null || props.disabled) {
    return
  }
  const index = selectedVariantIndex.value
  const variant = props.data.variations[index]

  if (loading.value[index]) {
    return
  }
  loading.value[index] = true
  emit('variant-chosen', variant)
}
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
          <div class="rate-plan-card__offers-item cancellation-policy-offer">
            <BflexIcon name="Restore"></BflexIcon>
            <BflexTooltip class="inline">
              <abbr>{{ data.cancellationPolicy.name || '' }}</abbr>
              <template #popper>
                <p
                  v-for="(rule, index) in data.cancellationPolicy.rules"
                  :key="index"
                >
                  {{ formatRuleDescription(rule) }}
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

          <div class="rate-plan-card__offers-item payment-type-offers">
            <BflexIcon name="CreditCard"></BflexIcon>
            <span>
              <strong style="margin-right: 0.375rem">{{ t('ratePlan.payments') }}:</strong>
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
        <!-- Десктопная версия (оставляем как есть) -->
        <div class="rate-plan-card__variants rate-plan-card__variants--desktop">
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
                class="book-button"
              >{{ t('ratePlan.action') }}</BflexButton>
            </BflexRatePlanVariantItem>
          </template>
          <span v-if="additionalFees.length" class="additional-fees--info">
            + addition fees
            <BflexTooltip class="inline-flex">
              <BflexIcon name="Info" small></BflexIcon>
              <template #popper>
                <p>These fees will be added on the final step.</p>
                <ul><li><strong>City tax:</strong> 2.5eur</li></ul>
              </template>
            </BflexTooltip>
          </span>
        </div>

        <!-- Мобильная версия (новая) -->
        <div class="rate-plan-card__variants rate-plan-card__variants--mobile">
          <span class="length-of-stay">{{ t('ratePlan.los', lengthOfStay) }}</span>

          <!-- Псевдо-селектор -->
          <div class="variant-selector">
            <div
              class="variant-selector__toggle"
              :class="{ 'variant-selector__toggle--disabled': disabled }"
              @click="toggleVariantSelector"
            >
              <div class="variant-selector__selected">
                <template v-if="selectedVariant">
                  <div class="variant-selector__icons">
                    <BflexScenarioIcon
                      :kind="selectedVariant.occupancyOptions.kind"
                      :main="selectedVariant.occupancyOptions.main"
                      :extra-bed="selectedVariant.occupancyOptions.extraBed"
                    />
                  </div>
                  <div class="variant-selector__price">
                    <span class="variant-selector__price-amount">
                      {{ formatMoney(selectedVariant.price.sellingPrice, selectedVariant.price.currency) }}
                    </span>
                    <span v-if="selectedVariant.price.discount" class="variant-selector__discount">
                      -{{ selectedVariant.price.discount }}%
                    </span>
                  </div>
                </template>
                <template v-else>
                  <span class="variant-selector__placeholder">{{ t('ratePlan.selectOccupancy') }}</span>
                </template>
                <BflexIcon :name="isVariantSelectorOpen ? 'ExpandLess' : 'ExpandMore'" />
              </div>
            </div>

            <!-- Выпадающий список вариантов -->
            <div v-if="isVariantSelectorOpen" class="variant-selector__dropdown">
              <div
                v-for="(variant, index) in data.variations"
                :key="index"
                class="variant-selector__option"
                :class="{ 'variant-selector__option--selected': selectedVariantIndex === index }"
                @click="selectVariant(index)"
              >
                <div class="variant-selector__option-content">
                  <div class="variant-selector__option-icons">
                    <BflexScenarioIcon
                      :kind="variant.occupancyOptions.kind"
                      :main="variant.occupancyOptions.main"
                      :extra-bed="variant.occupancyOptions.extraBed"
                    />
                  </div>
                  <div class="variant-selector__option-price">
                    <span class="variant-selector__option-price-amount">
                      {{ formatMoney(variant.price.sellingPrice, variant.price.currency) }}
                    </span>
                    <span v-if="variant.price.originalSellingPrice" class="variant-selector__option-price-original">
                      {{ formatMoney(variant.price.originalSellingPrice, variant.price.currency) }}
                    </span>
                  </div>
                </div>
                <BflexIcon v-if="selectedVariantIndex === index" name="Check" class="variant-selector__option-check" />
              </div>
            </div>
          </div>

          <!-- Единая кнопка бронирования -->
          <BflexButton
            :loading="selectedVariantIndex !== null && loading[selectedVariantIndex]"
            :disabled="!selectedVariant || disabled"
            @click="emitMobileVariantChosen"
            class="book-button book-button--mobile"
          >
            {{ t('ratePlan.action') }}
          </BflexButton>

          <span v-if="additionalFees.length" class="additional-fees--info">
            + addition fees
            <BflexTooltip class="inline-flex">
              <BflexIcon name="Info" small></BflexIcon>
              <template #popper>
                <p>These fees will be added on the final step.</p>
                <ul><li><strong>City tax:</strong> 2.5eur</li></ul>
              </template>
            </BflexTooltip>
          </span>
        </div>
      </slot>
    </div>
  </div>
</template>
