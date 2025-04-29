<script setup>
import { ref, defineProps, defineEmits, onMounted, computed, inject } from "vue";
import { loadCart, changePaymentType } from "../api/api.js";
import { lengthOfStay } from "../util/date.js";
import CustomerForm from "../components/CustomerForm.vue";
import Divider from "../components/InformationBlock/Divider.vue";
import Content from "../components/InformationBlock/Content.vue";
import InformationBlock from "../components/InformationBlock/InformationBlock.vue";
import Header from "../components/InformationBlock/Header.vue";
import Details from "../components/InformationBlock/Details.vue";
import AccommodationsCard from "../components/AccommodationsCard.vue";
import FieldDecorator from "../components/ui/FieldDecorator.vue";
import Checkbox from "../components/ui/Checkbox.vue";
import FixedSummary from "../components/FixedSummary.vue";
import Skeleton from "../components/Skeleton/Skeleton.vue";

defineProps({
  cart: {
    type: Object,
    default: () => ({
      id: '123',
      appliedPromoCode: false,
      currency: 'EUR',
      language: 'en',
      paymentTypes: [],
      requests: [],
      agreements: [],
      summary: {
        subtotal: '100.00',
        taxes: '20.00',
        fees: '0.00',
        discounts: '0.00',
        total: '120.00'
      }
    })
  }
});

/**
 * TODO: нужно добавить:
 * - политики отеля
 * - соглашения
 * - вместо id размещения и тарифа, нужно передавать объекты
 * - добавить политику отмены каждому размещению
 * - описание в paymentTypes
 */

const data = ref({
  customerInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  },
  comment: "",
  arrivalTime: "none",
  agreementList: [],
});
const emit = defineEmits(['removeFromCart', 'confirmCart']);
const onRemoveAccommodationHandler = (data) => {
  emit('removeFromCart', data);
};

const confirmForm = ref(null);
const settings = inject('settings');

const combinedAgreements = computed(() => {
  return settings.value.hotelRules.agreements.filter(item => item.combined);
});

const onSubmit = (event) => {
  event.preventDefault();
  console.log("Form submitted");
  if (confirmForm.value.reportValidity()) {
    emit('confirmCart', {
      customer: {
        ...data.value.customerInfo
      },
      comment: data.value.comment,
      arrivalTime: data.value.arrivalTime
    });
  }
}

const loading = ref(true);
const cart = ref(null);
onMounted(async () => {
  const result = await loadCart();
  cart.value = result.cart;
  loading.value = false;
});

const onChangePaymentType = async (data) => {
  const result = await changePaymentType(data);
  cart.value = result.cart;
}

const accommodationUnits = computed(() => {
  if (!cart.value || !cart.value.requests || Object.keys(cart.value.requests).length === 0) {
    return 0;
  }

  return Object.keys(cart.value.requests)
      .reduce((acc, id) => {
        const request = cart.value.requests[id];
        return acc + request.quantity;
      }, 0);
});

const lengthOfStayOfFirstRequest = computed(() => {
  if (!cart.value || !cart.value.requests || Object.keys(cart.value.requests).length === 0) {
    return 0;
  }

  return lengthOfStay(
      cart.value.requests[Object.keys(cart.value.requests)[0]].checkInDate,
      cart.value.requests[Object.keys(cart.value.requests)[0]].checkOutDate
  );
});
</script>

<template>
  <form @submit="onSubmit" ref="confirmForm">
    <InformationBlock>
      <Header>Contact information</Header>
      <Divider></Divider>
      <Content>
        <CustomerForm v-model="data.customerInfo" />
        <Details>
          Подтверждение бронирования придет на электронную почту. Владелец места может связаться с вами по телефону для уточнения деталей.
        </Details>
      </Content>
    </InformationBlock>

    <Skeleton v-if="loading || !cart" is-result></Skeleton>
    <AccommodationsCard
        v-else
        :cart="cart"
        :currency="cart.currency"
        :payment="cart.payment"
        :summary="cart.summary"
        :items="cart.requests"
        @change-payment-type="onChangePaymentType"
        @delete-request="onRemoveAccommodationHandler"
    ></AccommodationsCard>

    <InformationBlock>
      <Header>Comment for administrator</Header>
      <Divider></Divider>
      <Content>
        <FieldDecorator label="Comment">
          <textarea
              :value="data.comment"
              @input="data.comment = $event.target.value"
              name="comment"
              rows="3"
              maxlength="500"
          ></textarea>
        </FieldDecorator>
      </Content>
      <Divider></Divider>
      <Header dense>
        Check-in/out time
        <template v-slot:additional>Check-in time from: {{ settings.policies.arrivalPolicy.checkInTime }}; Check-out time to: {{ settings.policies.arrivalPolicy.checkOutTime }}</template>
      </Header>
      <Divider></Divider>
      <Content>
        <FieldDecorator label="Your arrival time" style="width: 50%;">
          <select name="arrivalTime" :value="data.arrivalTime" @change="data.arrivalTime = $event.target.value">
            <option value="none" selected>Еще не знаю</option>
            <option value="14:00">{{ settings.policies.arrivalPolicy.checkOutTime }}</option>
            <option value="15:00">{{ settings.policies.arrivalPolicy.checkOutTime }}</option>
          </select>
        </FieldDecorator>
      </Content>
    </InformationBlock>

    <InformationBlock>
      <Header>Accommodation rules</Header>
      <template v-if="settings.hotelRules.rules.length > 0">
        <Divider></Divider>
        <Content>
          <ul>
            <li v-for="(rule, idx) in settings.hotelRules.rules" :key="idx">{{ rule.text }}</li>
          </ul>
        </Content>
      </template>
      <Divider></Divider>
      <Content>
        <div class="agreements-list__items">
          <label v-if="combinedAgreements.length > 0" class="agreements-list__item">
            <Checkbox model-value="model-value" required></Checkbox>
            <span>Подтверждаю, что ознакомился и согласен c <a class="combined-agreement" target="_blank" v-for="agreement in combinedAgreements" :href="agreement.url">{{ agreement.anchor }}</a>.</span>
          </label>
          <template v-for="agreement in settings.hotelRules.agreements">
            <label v-if="agreement.combined === false" class="agreements-list__item">
              <Checkbox model-value="model-value" :required="agreement.required"></Checkbox>
              <span>Подтверждаю, что <a target="_blank" :href="agreement.url">{{ agreement.anchor }}</a></span>
            </label>
          </template>
        </div>
      </Content>
    </InformationBlock>

    <FixedSummary
        v-if="!loading && cart"
        :total-amount="cart.summary.total"
        :currency="cart.currency"
        :accommodation-units="accommodationUnits"
        :length-of-stay="lengthOfStayOfFirstRequest"
    ></FixedSummary>
  </form>
</template>

<style lang="scss">
.agreements-list__items {
  margin-top: 1em;
  font-size: .9em;

  .agreements-list__item {
    display: flex;
    flex-direction: row;
    margin-bottom: .6em;
    cursor: pointer;

    .combined-agreement {
      color: orangered;
      text-decoration: underline;
      padding: 0;

      &:after {
        display: inline-block;
        padding-right: .5em;
        content: ', ';
        text-decoration: none;
      }

      &:last-child {
        &:after {
          content: '';
          display: none;
        }
      }
    }
  }
}
</style>
