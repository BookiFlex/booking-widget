<script setup>
import { defineEmits, defineProps, reactive, watch } from 'vue'
import { timeRangeGenerator } from '@/util/date.js'
import BflexFieldDecorator from '@/components/ui/BflexFieldDecorator.vue'
import BflexInformationBlock from '@/components/InformationBlock/BflexInformationBlock.vue'
import BflexContent from '@/components/InformationBlock/BflexContent.vue'
import BflexHeader from '@/components/InformationBlock/BflexHeader.vue'
import BflexDivider from '@/components/InformationBlock/BflexDivider.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      comment: '',
      arrivalTime: 'none',
    }),
  },
  arrivalPolicy: {
    type: Object,
    default: () => ({
      checkInTime: '14:00',
      checkOutTime: '11:00',
    }),
  },
})

const t = {
  title: window.wp.i18n.__('Special Requests', 'bookiflex'),
  comment: window.wp.i18n.__('Comments or special requests', 'bookiflex'),
  checkInOutTime: window.wp.i18n.__('Check-in/Check-out time', 'bookiflex'),
  checkInTimeFrom: window.wp.i18n.__('Check-in from', 'bookiflex'),
  checkOutTimeUntil: window.wp.i18n.__('Check-out until', 'bookiflex'),
  arrivalTime: window.wp.i18n.__('Expected arrival time', 'bookiflex'),
  noneTime: window.wp.i18n.__('None', 'bookiflex')
}

const emit = defineEmits(['update:modelValue'])
const data = reactive({ ...props.modelValue })
const timeSlots = timeRangeGenerator('00:00', '23:00')

watch(
  data,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true },
)
</script>

<template>
  <BflexInformationBlock class="customer-request-block">
    <BflexHeader>{{ t.title }}</BflexHeader>
    <BflexDivider></BflexDivider>
    <BflexContent>
      <BflexFieldDecorator :label="t.comment">
        <textarea v-model="data.comment" name="comment" rows="3" maxlength="500"></textarea>
      </BflexFieldDecorator>
    </BflexContent>
    <BflexDivider></BflexDivider>
    <BflexContent>
      <dl class="text-sm">
        <dt>{{ t.checkInOutTime }}:</dt>
        <dd>
          {{ t.checkInTimeFrom }}: {{ arrivalPolicy.checkInTime }};
          {{ t.checkOutTimeUntil }}: {{ arrivalPolicy.checkOutTime }}
        </dd>
      </dl>
    </BflexContent>
    <BflexDivider></BflexDivider>
    <BflexContent>
      <BflexFieldDecorator :label="t.arrivalTime" style="width: 50%">
        <select name="arrivalTime" v-model="data.arrivalTime">
          <option value="none" selected>{{ t.noneTime }}</option>
          <option v-for="time in timeSlots" :value="time" :key="time">{{ time }}</option>
        </select>
      </BflexFieldDecorator>
    </BflexContent>
  </BflexInformationBlock>
</template>

<style scoped lang="scss"></style>
