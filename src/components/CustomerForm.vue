<script setup>
import { reactive, watch, defineProps, defineEmits } from 'vue';
import FieldDecorator from "./ui/FieldDecorator.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);
const customer = reactive({ ...props.modelValue });

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  comment: ''
});

const validateField = (field) => {
  switch (field) {
    case 'firstName':
    case 'lastName':
      if (!customer[field]) {
        errors[field] = 'This field is required';
      } else if (customer[field].length < 2) {
        errors[field] = 'Minimum length is 2 characters';
      } else if (customer[field].length > 50) {
        errors[field] = 'Maximum length is 50 characters';
      } else {
        errors[field] = '';
      }
      break;
    case 'email':
      if (!customer.email) {
        errors.email = 'This field is required';
      } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
        errors.email = 'Invalid email address';
      } else {
        errors.email = '';
      }
      break;
    case 'phone':
      if (!customer.phone) {
        errors.phone = 'This field is required';
      } else if (customer.phone.length < 7) {
        errors.phone = 'Minimum length is 7 characters';
      } else if (customer.phone.length > 100) {
        errors.phone = 'Maximum length is 100 characters';
      } else {
        errors.phone = '';
      }
      break;
    case 'comment':
      if (customer.comment.length > 500) {
        errors.comment = 'Maximum length is 500 characters';
      } else {
        errors.comment = '';
      }
      break;
  }
};

const checkValidity = (event) => {
  const input = event.target;
  errors[input.name] = input.validity.valid ? "" : input.validationMessage;
  // input.reportValidity();
};

watch(customer, (newVal) => {
  emit('update:modelValue', newVal);
}, { deep: true });
</script>

<template>
  <section id="customer-form" class="customer-form">
    <FieldDecorator
        label="First name"
        required
        :hint="errors.firstName"
        :class="{ 'form-group--error': errors.firstName }">
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
        :class="{ 'form-group--error': errors.lastName }">
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
        :class="{ 'form-group--error': errors.email }">
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
        :class="{ 'form-group--error': errors.phone }">
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
</template>

<style lang="scss">
@import "../assets/css/customer-form.scss";
</style>
