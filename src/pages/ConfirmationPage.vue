<script setup>
import { ref, defineEmits, onMounted, inject, nextTick } from 'vue'
import BflexContactInformationCard from '../components/BflexContactInformationCard.vue'
import BflexSummaryPanel from '../components/BflexSummaryPanel.vue'
import BflexSpecialRequestCard from '@/components/BflexSpecialRequestCard.vue'
import BflexAccommodationRulesCard from '@/components/BflexAccommodationRulesCard.vue'
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue'
import { BOOKING_CONFIRMATION, EMPTY_CART } from '@/constants.js'
import { useCart } from '@/composables/useCart.js'
import BflexEditableAccommodationCard from '@/components/BflexEditableAccommodationCard.vue'

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
    arrivalTime: '14:00',
  },
  agreementList: [],
})

const confirmForm = ref(null)
const isSubmitting = ref(false)
const formErrors = ref({})

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
      setTimeout(() => {
        emit('released', { action: EMPTY_CART })
      }, 300)
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

const validateForm = () => {
  const errors = {}

  if (!data.value.customerInfo.firstName) {
    errors.firstName = true
  }
  if (!data.value.customerInfo.lastName) {
    errors.lastName = true
  }
  if (!data.value.customerInfo.email) {
    errors.email = true
  }
  // if (!data.value.customerInfo.phone) {
  //   errors.phone = true
  // }

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const onSubmit = async (event) => {
  event.preventDefault()

  if (!validateForm()) {

    // Shake animation for errors
    await nextTick()

    const errorElements = document.querySelectorAll('.field-error')
    console.log('errorElements', errorElements)
    errorElements.forEach(el => {
      el.classList.add('error-shake')
      setTimeout(() => el.classList.remove('error-shake'), 500)
    })
    return
  }

  if (confirmForm.value.reportValidity()) {
    isSubmitting.value = true

    try {
      const result = await confirmCart(
        data.value.customerInfo,
        data.value.specialRequest.comment,
        data.value.specialRequest.arrivalTime
      )

      if (result?.reservations) {
        // Success animation
        document.querySelector('.booking-confirmation')?.classList.add('success-bounce')

        setTimeout(() => {
          emit('released', { action: BOOKING_CONFIRMATION, result })
        }, 600)
      }
    } catch (error) {
      setError(error)
      isSubmitting.value = false
    }
  }
}
</script>

<template>
  <form @submit="onSubmit" ref="confirmForm">
    <BflexGridGap>
      <BflexContactInformationCard v-model="data.customerInfo" />

      <BflexEditableAccommodationCard
        v-if="cart && !isEmpty"
        :loading="loading"
        :locale="settings.widget.locale"
        :payment="cart.payment"
        :totals="cart.totals"
        :reservation="firstItem"
        @changePaymentType="onChangePaymentType"
        @deleteAccommodation="onDeleteAccommodation"
      ></BflexEditableAccommodationCard>

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
