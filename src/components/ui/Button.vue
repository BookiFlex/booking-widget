<script setup>
import { computed } from 'vue';
import Loader from './Loader.vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'medium',
  },
  fill: {
    type: Boolean,
    default: false,
  },
  isRound: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  loaderSize: {
    type: String,
    default: '8px',
  },
  loaderColor: {
    type: String,
    default: '#1f73b7',
  },
  disabled: {
    type: [Boolean, String],
    default: false,
  },
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String,
    default: '',
  },
  rel: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['click']);

const classList = computed(() => [
  props.variant === 'link'
    ? 'vs-button__link'
    : `vs-button__${props.variant}${props.fill ? '-fill' : ''}`,
  `vs-button--${props.size}`,
  { 'vs-button--loading': props.isLoading },
  { 'vs-button--round': props.isRound },
]);

const isLink = computed(() =>
  props.variant === 'link' || !!props.href ? 'a' : 'button'
);

function emitClick(event) {
  if (!props.isLoading && !props.disabled) {
    emit('click', event);
  }
}
</script>

<template>
  <component
    :is="isLink"
    :role="href ? 'button' : false"
    :href="href"
    :target="target"
    :rel="rel"
    :type="isLink ? 'button' : false"
    :disabled="disabled || isLoading"
    :class="['vs-button', classList]"
    @click="emitClick"
  >
    <Loader :size="loaderSize" :color="loaderColor" v-if="isLoading"></Loader>
    <slot v-else></slot>
  </component>
</template>

<style scoped lang="scss">
@forward "../../assets/css/button.scss";
</style>
