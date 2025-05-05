<script setup>
import { ref, defineEmits, onMounted, computed, inject } from 'vue'
import { loadCart, changePaymentType } from '../api/api.js'
import { lengthOfStay } from '../util/date.js'
import ContactInformationBlock from '../components/ContactInformationBlock.vue'
import ChosenAccommodationsBlock from '../components/ChosenAccommodationsBlock.vue'
import SummaryBlock from '../components/SummaryBlock.vue'
import CustomerRequestBlock from '@/components/CustomerRequestBlock.vue'
import AccommodationRulesBlock from '@/components/AccommodationRulesBlock.vue'
import InformationBlockGrid from '@/components/InformationBlock/InformationBlockGrid.vue'

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
const emit = defineEmits(['deleteFromCart', 'confirmCart'])
const onDeleteAccommodationRequest = (data) => {
  emit('deleteFromCart', data)
}

const confirmForm = ref(null)
const settings = inject('settings')

const onSubmit = (event) => {
  event.preventDefault()
  if (confirmForm.value.reportValidity()) {
    emit('confirmCart', {
      customer: {
        ...data.value.customerInfo,
      },
      comment: data.value.comment,
      arrivalTime: data.value.arrivalTime,
    })
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
      <InformationBlockGrid>

      <ContactInformationBlock v-model="data.customerInfo" />

      <ChosenAccommodationsBlock
        v-if="cart"
        :loading="loading"
        :cart="cart"
        :currency="cart.currency"
        :payment="cart.payment"
        :summary="cart.summary"
        :items="cart.requests"
        @changePaymentType="onChangePaymentType"
        @deleteAccommodationRequest="onDeleteAccommodationRequest"
      ></ChosenAccommodationsBlock>

      <CustomerRequestBlock v-model="data.customerRequest"></CustomerRequestBlock>
      <AccommodationRulesBlock
        :agreements="settings.hotelRules.agreements"
        :rules="settings.hotelRules.rules"
      ></AccommodationRulesBlock>

      <SummaryBlock
        v-if="!loading && cart"
        :total-amount="cart.summary.total"
        :currency="cart.currency"
        :accommodation-units="accommodationUnits"
        :length-of-stay="lengthOfStayOfFirstRequest"
      ></SummaryBlock>
      </InformationBlockGrid>
    </form>
</template>

<style lang="scss">
</style>
