<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import BflexContactInformationCard from '../components/BflexContactInformationCard.vue';
import BflexChosenAccommodationsCard from '../components/BflexChosenAccommodationsCard.vue';
import BflexSummaryPanel from '../components/BflexSummaryPanel.vue';
import BflexSpecialRequestCard from '@/components/BflexSpecialRequestCard.vue';
import BflexAccommodationRulesCard from '@/components/BflexAccommodationRulesCard.vue';
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue';
import { useBooking } from '@/composables/useBooking';

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
});

const confirmForm = ref(null);
const settings = inject('settings');

const { cart, loading, loadCart, changePaymentType, removeFromCart, confirmCart: confirmCartAction } = useBooking();

onMounted(loadCart);

const onSubmit = async (event) => {
  event.preventDefault();
  if (confirmForm.value.reportValidity()) {
    await confirmCartAction({
      customer: {
        ...data.value.customerInfo,
      },
      specialRequest: data.value.specialRequest.comment,
      arrivalTime: data.value.specialRequest.arrivalTime,
    });
  }
};

const accommodationUnits = computed(() => {
  if (!cart.value || !cart.value.items) {
    return 0;
  }

  return cart.value.items.reduce((acc, accommodation) => {
    return acc + accommodation.quantity;
  }, 0);
});

const isEmpty = computed(() => {
  return !cart.value || cart.value.items.length === 0;
});

const firstAccommodation = computed(() => {
  if (isEmpty.value) {
    return null;
  }
  return cart.value.items[Object.keys(cart.value.items)[0]];
});

const lengthOfStay = computed(() => {
  if (isEmpty.value) {
    return 0;
  }
  return firstAccommodation.value.details.accommodation.lengthOfStay;
});
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
        @changePaymentType="changePaymentType"
        @deleteAccommodation="removeFromCart"
      />

      <BflexSpecialRequestCard v-model="data.specialRequest" />
      <BflexAccommodationRulesCard
        :agreements="settings.hotelRules.agreements"
        :rules="settings.hotelRules.rules"
      />

      <BflexSummaryPanel
        v-if="!loading && cart"
        :totals="cart.totals"
        :accommodation-units="accommodationUnits"
        :length-of-stay="lengthOfStay"
      />
    </BflexGridGap>
  </form>
</template>

<style lang="scss"></style>
