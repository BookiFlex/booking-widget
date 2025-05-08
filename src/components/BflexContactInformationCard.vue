<script setup>
import { reactive, watch, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import BflexFieldDecorator from './ui/BflexFieldDecorator.vue'
import BflexInformationBlock from '@/components/InformationBlock/BflexInformationBlock.vue'
import BflexContent from '@/components/InformationBlock/BflexContent.vue'
import BflexHeader from '@/components/InformationBlock/BflexHeader.vue'
import BflexDivider from '@/components/InformationBlock/BflexDivider.vue'
import BflexDetailsInfo from '@/components/ui/BflexDetailsInfo.vue'

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
  <BflexInformationBlock>
    <BflexHeader>{{ t('contactInformation.title') }}</BflexHeader>
    <BflexDivider></BflexDivider>
    <BflexContent>
      <section id="customer-data-form" class="customer-data-form">
        <BflexFieldDecorator
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
        </BflexFieldDecorator>

        <BflexFieldDecorator
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
        </BflexFieldDecorator>

        <BflexFieldDecorator
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
        </BflexFieldDecorator>

        <BflexFieldDecorator
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
        </BflexFieldDecorator>
      </section>
      <BflexDetailsInfo icon="Info">
        {{ t('contactInformation.confirmationInfo') }}
      </BflexDetailsInfo>
    </BflexContent>
  </BflexInformationBlock>
</template>

<style lang="scss">
</style>
