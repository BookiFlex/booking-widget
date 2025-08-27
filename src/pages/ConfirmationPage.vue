<script setup>
import { ref, defineEmits, onMounted, computed, inject } from 'vue'
import { loadCart, changePaymentType, removeFromCart, confirmCart } from '../api/api.js'
import BflexContactInformationCard from '../components/BflexContactInformationCard.vue'
import BflexChosenAccommodationsCard from '../components/BflexChosenAccommodationsCard.vue'
import BflexSummaryPanel from '../components/BflexSummaryPanel.vue'
import BflexSpecialRequestCard from '@/components/BflexSpecialRequestCard.vue'
import BflexAccommodationRulesCard from '@/components/BflexAccommodationRulesCard.vue'
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue'
import { BOOKING_CONFIRMATION, EMPTY_CART } from '@/constants.js'

const data = ref({
  customerInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  specialRequest: {
    comment: '',
    arrivalTime: 'none',
  },
  agreementList: [],
})
const emit = defineEmits(['released'])
const onDeleteAccommodation = async (hash) => {
  loading.value = true

  try {
    const result = await removeFromCart(hash)
    cart.value = result.cart
    if (result.cart.items.length === 0) {
      emit('released', { action: EMPTY_CART, result })
    }
  } catch (error) {
    setError(error)
  } finally {
    loading.value = false
  }
}

const confirmForm = ref(null)
const settings = inject('settings')

const onSubmit = async (event) => {
  event.preventDefault()
  if (confirmForm.value.reportValidity()) {
    loading.value = true

    try {
      const result = await confirmCart({
        customer: {
          ...data.value.customerInfo,
        },
        specialRequest: data.value.specialRequest.comment,
        arrivalTime: data.value.specialRequest.arrivalTime,
      })

      if (result && result.reservations) {
        emit('released', { action: BOOKING_CONFIRMATION, result })
      }
    } catch (error) {
      setError(error)
    } finally {
      loading.value = false
    }
  }
}

const loading = ref(true)
const cart = ref(null)
const { setError } = inject('globalError')

onMounted(async () => {
  loading.value = true
  try {
    const result = await loadCart()
    cart.value = result.cart
  } catch (error) {
    setError(error)
  } finally {
    loading.value = false
  }
})

const onChangePaymentType = async (paymentType) => {
  try {
    const result = await changePaymentType({
      request: Object.keys(cart.value.items)[0],
      paymentType,
    })
    cart.value = result.cart
  } catch (error) {
    setError(error)
  }
}

const accommodationUnits = computed(() => {
  if (!cart.value || !cart.value.items) {
    return 0
  }

  return cart.value.items.reduce((acc, accommodation) => {
    return acc + accommodation.quantity
  }, 0)
})

const isEmpty = computed(() => {
  return !cart.value && cart.value.items.length === 0
})

const firstAccommodation = computed(() => {
  return cart.value.items[Object.keys(cart.value.items)[0]]
})

const lengthOfStay = computed(() => {
  if (isEmpty.value) {
    return 0
  }
  return firstAccommodation.value.details.accommodation.lengthOfStay
})
</script>

<template>
  <form @submit="onSubmit" ref="confirmForm">
    <BflexGridGap>
      <BflexContactInformationCard v-model="data.customerInfo" />

      <BflexChosenAccommodationsCard
        v-if="cart && !isEmpty"
        mode="choose"
        :loading="loading"
        :locale="settings.widget.locale"
        :payment="cart.payment"
        :totals="cart.totals"
        :reservation="firstAccommodation"
        @changePaymentType="onChangePaymentType"
        @deleteAccommodation="onDeleteAccommodation"
      ></BflexChosenAccommodationsCard>

      <BflexSpecialRequestCard v-model="data.specialRequest"></BflexSpecialRequestCard>
      <BflexAccommodationRulesCard
        :agreements="settings.hotelRules.agreements"
        :rules="settings.hotelRules.rules"
      ></BflexAccommodationRulesCard>

      <BflexSummaryPanel
        v-if="!loading && cart"
        :totals="cart.totals"
        :accommodation-units="accommodationUnits"
        :length-of-stay="lengthOfStay"
      ></BflexSummaryPanel>
    </BflexGridGap>
  </form>
</template>

<style lang="scss"></style>
