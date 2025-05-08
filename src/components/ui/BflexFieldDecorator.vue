<script setup>
import { defineProps } from 'vue'
defineProps({
  label: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    default: '',
  },
  hideHint: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="field-decorator">
    <div class="field-decorator__input-group">
      <label class="field-decorator__label"
        >{{ label }}<span class="field-decorator__required" v-if="required">*</span></label
      >
      <div class="field-decorator__slot">
        <slot></slot>
      </div>
    </div>
    <div v-if="!hideHint" class="field-decorator__hint">{{ hint }}</div>
  </div>
</template>

<style lang="scss">
</style>
