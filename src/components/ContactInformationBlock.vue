<script setup>
import { reactive, watch, defineProps, defineEmits } from 'vue'
import FieldDecorator from './ui/FieldDecorator.vue'
import InformationBlock from '@/components/InformationBlock/InformationBlock.vue'
import Content from '@/components/InformationBlock/Content.vue'
import Header from '@/components/InformationBlock/Header.vue'
import Divider from '@/components/InformationBlock/Divider.vue'
import Details from '@/components/InformationBlock/Details.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }),
  },
})

const emit = defineEmits(['update:modelValue'])
const customer = reactive({ ...props.modelValue })

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const checkValidity = (event) => {
  const input = event.target
  errors[input.name] = input.validity.valid ? '' : input.validationMessage
  // input.reportValidity();
}

watch(
  customer,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true },
)
</script>

<template>
  <InformationBlock>
    <Header>Contact information</Header>
    <Divider></Divider>
    <Content>
      <section id="customer-data-form" class="customer-data-form">
        <FieldDecorator
          label="First name"
          required
          :hint="errors.firstName"
          :class="{ 'form-group--error': errors.firstName }"
        >
          <input
            v-model.trim="customer.firstName"
            type="text"
            name="firstName"
            minlength="2"
            maxlength="50"
            required
            @input="checkValidity($event)"
          />
        </FieldDecorator>

        <FieldDecorator
          label="Last name"
          required
          :hint="errors.lastName"
          :class="{ 'form-group--error': errors.lastName }"
        >
          <input
            v-model.trim="customer.lastName"
            type="text"
            name="lastName"
            minlength="2"
            maxlength="50"
            required
            @input="checkValidity($event)"
          />
        </FieldDecorator>

        <FieldDecorator
          label="Email"
          required
          :hint="errors.email"
          :class="{ 'form-group--error': errors.email }"
        >
          <input
            v-model.trim="customer.email"
            type="email"
            name="email"
            maxlength="100"
            required
            @input="checkValidity($event)"
          />
        </FieldDecorator>

        <FieldDecorator
          label="Phone"
          :hint="errors.phone"
          :class="{ 'form-group--error': errors.phone }"
        >
          <input
            v-model.trim="customer.phone"
            type="tel"
            name="phone"
            minlength="7"
            maxlength="100"
            @input="checkValidity($event)"
          />
        </FieldDecorator>
      </section>
      <Details>
        Подтверждение бронирования придет на электронную почту. Владелец места может связаться с
        вами по телефону для уточнения деталей.
      </Details>
    </Content>
  </InformationBlock>
</template>

<style lang="scss">
</style>
