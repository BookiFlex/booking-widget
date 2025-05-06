<script setup>
import { defineEmits, defineProps, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldDecorator from '@/components/ui/FieldDecorator.vue'
import InformationBlock from '@/components/InformationBlock/InformationBlock.vue'
import Content from '@/components/InformationBlock/Content.vue'
import Header from '@/components/InformationBlock/Header.vue'
import Divider from '@/components/InformationBlock/Divider.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      comment: '',
      arrivalTime: 'none'
    }),
  },
  arrivalPolicy: {
    type: Object,
    default: () => ({
      checkInTime: '14:00',
      checkOutTime: '11:00',
    })
  }
})
const { t } = useI18n()

const emit = defineEmits(['update:modelValue'])
const data = reactive({ ...props.modelValue })

watch(
  data,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true },
)
</script>

<template>
  <InformationBlock class="customer-request-block">
    <Header>{{ t('customerRequest.title') }}</Header>
    <Divider></Divider>
    <Content>
      <FieldDecorator :label="t('customerRequest.comment')">
          <textarea
            v-model="data.comment"
            name="comment"
            rows="3"
            maxlength="500"
          ></textarea>
      </FieldDecorator>
    </Content>
    <Divider></Divider>
    <Content>
      <dl class="text-sm">
        <dt>{{ t('customerRequest.checkInOutTime') }}:</dt>
        <dd>{{ t('customerRequest.checkInTimeFrom') }}: {{ arrivalPolicy.checkInTime }}; {{ t('customerRequest.checkOutTimeUntil') }}:
          {{ arrivalPolicy.checkOutTime }}</dd>
      </dl>
    </Content>
    <Divider></Divider>
    <Content>
      <FieldDecorator :label="t('customerRequest.arrivalTime')" style="width: 50%">
        <select
          name="arrivalTime"
          v-model="data.arrivalTime"
        >
          <option value="none" selected>{{ t('customerRequest.noneTime') }}</option>
          <option value="14:00">{{ arrivalPolicy.checkOutTime }}</option>
          <option value="15:00">{{ arrivalPolicy.checkOutTime }}</option>
        </select>
      </FieldDecorator>
    </Content>
  </InformationBlock>
</template>

<style scoped lang="scss">
</style>
