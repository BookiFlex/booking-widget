<script setup>
import { ref, defineEmits, onMounted, computed, inject } from 'vue'
import { loadCart, changePaymentType, updateCart, confirmCart } from '../api/api.js'
import { lengthOfStay } from '../util/date.js'
import BflexContactInformationCard from '../components/BflexContactInformationCard.vue'
import BflexChosenAccommodationsCard from '../components/BflexChosenAccommodationsCard.vue'
import BflexSummaryPanel from '../components/BflexSummaryPanel.vue'
import BflexCustomerRequestCard from '@/components/BflexCustomerRequestCard.vue'
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
  customerRequest: {
    comment: '',
    arrivalTime: 'none',
  },
  agreementList: [],
})
const emit = defineEmits(['released'])
const onDeleteAccommodationRequest = async ({
  checkInDate,
  checkOutDate,
  accommodationType,
  ratePlan,
  adults,
  children,
  quantity,
}) => {
  loading.value = true

  try {
    const result = await updateCart({
      checkInDate,
      checkOutDate,
      accommodationType,
      ratePlan,
      adults,
      children,
      quantity,
    })
    cart.value = result.cart
    if (result.cart.requests.length === 0) {
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
        comment: data.value.comment,
        arrivalTime: data.value.arrivalTime,
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

const onChangePaymentType = async (data) => {
  try {
    const result = await changePaymentType(data)
    cart.value = result.cart
  } catch (error) {
    setError(error)
  }
}

const accommodationUnits = computed(() => {
  if (!cart.value || !cart.value.requests || Object.keys(cart.value.requests).length === 0) {
    return 0
  }

  return Object.keys(cart.value.requests).reduce((acc, id) => {
    const request = cart.value.requests[id]
    return acc + request.quantity
  }, 0)
})

const lengthOfStayOfFirstRequest = computed(() => {
  if (!cart.value || !cart.value.requests || Object.keys(cart.value.requests).length === 0) {
    return 0
  }

  return lengthOfStay(
    cart.value.requests[Object.keys(cart.value.requests)[0]].checkInDate,
    cart.value.requests[Object.keys(cart.value.requests)[0]].checkOutDate,
  )
})
</script>

<template>
  <form @submit="onSubmit" ref="confirmForm">
    <BflexGridGap>
      <BflexContactInformationCard v-model="data.customerInfo" />

      <BflexChosenAccommodationsCard
        v-if="cart"
        :loading="loading"
        :cart="cart"
        :currency="cart.currency"
        :locale="settings.widget.locale"
        :payment="cart.payment"
        :summary="cart.summary"
        :items="cart.requests"
        @changePaymentType="onChangePaymentType"
        @deleteAccommodationRequest="onDeleteAccommodationRequest"
      ></BflexChosenAccommodationsCard>

      <BflexCustomerRequestCard v-model="data.customerRequest"></BflexCustomerRequestCard>
      <BflexAccommodationRulesCard
        :agreements="settings.hotelRules.agreements"
        :rules="settings.hotelRules.rules"
      ></BflexAccommodationRulesCard>

      <BflexSummaryPanel
        v-if="!loading && cart"
        :total-amount="cart.summary.total"
        :currency="cart.currency"
        :accommodation-units="accommodationUnits"
        :length-of-stay="lengthOfStayOfFirstRequest"
      ></BflexSummaryPanel>
    </BflexGridGap>
  </form>
</template>

<style lang="scss"></style>
