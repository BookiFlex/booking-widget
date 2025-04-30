<script setup>
import { defineEmits, defineProps, reactive, watch } from 'vue'
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
  <InformationBlock>
    <Header>Customer request</Header>
    <Divider></Divider>
    <Content>
      <FieldDecorator label="Comment">
          <textarea
            v-model="data.comment"
            name="comment"
            rows="3"
            maxlength="500"
          ></textarea>
      </FieldDecorator>
    </Content>
    <Divider></Divider>
    <Header dense>
      Check-in/out time
      <template v-slot:additional
      >Check-in time from: {{ arrivalPolicy.checkInTime }}; Check-out time to:
        {{ arrivalPolicy.checkOutTime }}</template
      >
    </Header>
    <Divider></Divider>
    <Content>
      <FieldDecorator label="Your arrival time" style="width: 50%">
        <select
          name="arrivalTime"
          v-model="data.arrivalTime"
        >
          <option value="none" selected>Еще не знаю</option>
          <option value="14:00">{{ arrivalPolicy.checkOutTime }}</option>
          <option value="15:00">{{ arrivalPolicy.checkOutTime }}</option>
        </select>
      </FieldDecorator>
    </Content>
  </InformationBlock>
</template>

<style scoped lang="scss">

</style>
