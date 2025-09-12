<script setup>
import { ref, defineEmits, onMounted, inject } from 'vue'
import BflexContactInformationCard from '../components/BflexContactInformationCard.vue'
import BflexChosenAccommodationsCard from '../components/BflexChosenAccommodationsCard.vue'
import BflexSummaryPanel from '../components/BflexSummaryPanel.vue'
import BflexSpecialRequestCard from '@/components/BflexSpecialRequestCard.vue'
import BflexAccommodationRulesCard from '@/components/BflexAccommodationRulesCard.vue'
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue'
import { BOOKING_CONFIRMATION, EMPTY_CART } from '@/constants.js'
import { useCart } from '@/composables/useCart.js'

const emit = defineEmits(['released'])
const settings = inject('settings')
const { setError } = inject('globalError')

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

const confirmForm = ref(null)

// Используем composables
const {
  cart,
  loading,
  isEmpty,
  firstItem,
  lengthOfStay,
  accommodationUnits,
  loadCart,
  removeFromCart,
  changePaymentType,
  confirmCart
} = useCart()

onMounted(async () => {
  try {
    await loadCart()
  } catch (error) {
    setError(error)
  }
})

const onDeleteAccommodation = async (hash) => {
  try {
    await removeFromCart(hash)
    if (isEmpty.value) {
      emit('released', { action: EMPTY_CART })
    }
  } catch (error) {
    setError(error)
  }
}

const onChangePaymentType = async (paymentType) => {
  try {
    // Используем hash первого элемента из массива
    if (cart.value?.items?.[0]) {
      await changePaymentType(cart.value.items[0].hash, paymentType)
    }
  } catch (error) {
    setError(error)
  }
}

const onSubmit = async (event) => {
  event.preventDefault()
  if (confirmForm.value.reportValidity()) {
    try {
      const result = await confirmCart(
        data.value.customerInfo,
        data.value.specialRequest.comment,
        data.value.specialRequest.arrivalTime
      )

      if (result?.reservations) {
        emit('released', { action: BOOKING_CONFIRMATION, result })
      }
    } catch (error) {
      setError(error)
    }
  }
}
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
        :reservation="firstItem"
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
