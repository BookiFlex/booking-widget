<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const isChecked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <label class="custom-checkbox">
    <input type="checkbox" v-model="isChecked" :required="required" />
    <span class="custom-checkbox__box"></span>
    <slot></slot>
  </label>
</template>

<style lang="scss">
</style>
