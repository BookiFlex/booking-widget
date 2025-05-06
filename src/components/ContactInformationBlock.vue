<script setup>
import { reactive, watch, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldDecorator from './ui/FieldDecorator.vue'
import InformationBlock from '@/components/InformationBlock/InformationBlock.vue'
import Content from '@/components/InformationBlock/Content.vue'
import Header from '@/components/InformationBlock/Header.vue'
import Divider from '@/components/InformationBlock/Divider.vue'
import DetailsInfo from '@/components/ui/DetailsInfo.vue'

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
const { t } = useI18n()

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
    <Header>{{ t('contactInformation.title') }}</Header>
    <Divider></Divider>
    <Content>
      <section id="customer-data-form" class="customer-data-form">
        <FieldDecorator
          :label="t('contactInformation.firstName')"
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
          :label="t('contactInformation.lastName')"
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
          :label="t('contactInformation.email')"
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
          :label="t('contactInformation.phoneNumber')"
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
      <DetailsInfo icon="Info">
        {{ t('contactInformation.confirmationInfo') }}
      </DetailsInfo>
    </Content>
  </InformationBlock>
</template>

<style lang="scss">
</style>
