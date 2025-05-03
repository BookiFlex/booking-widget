<script setup>
import { computed } from 'vue';
import { toRefs } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: '#1f73b7',
  },
  size: {
    type: String,
    default: '40px',
  },
  margin: {
    type: String,
    default: '3px',
  },
  radius: {
    type: String,
    default: '100%',
  },
});

const { color, size, margin, radius } = toRefs(props);

const spinnerStyle = computed(() => ({
  backgroundColor: color.value,
  width: size.value,
  height: size.value,
  margin: margin.value,
  borderRadius: radius.value,
  display: 'inline-block',
  animationName: 'v-pulseStretchDelay',
  animationDuration: '0.75s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'cubic-bezier(.2,.68,.18,1.08)',
  animationFillMode: 'both',
}));

const spinnerDelay1 = computed(() => ({ animationDelay: '0.12s' }));
const spinnerDelay2 = computed(() => ({ animationDelay: '0.24s' }));
const spinnerDelay3 = computed(() => ({ animationDelay: '0.36s' }));
</script>

<template>
  <div class="cycle-loader">
    <div :style="[spinnerStyle, spinnerDelay1]"></div>
    <div :style="[spinnerStyle, spinnerDelay2]"></div>
    <div :style="[spinnerStyle, spinnerDelay3]"></div>
  </div>
</template>

<style lang="scss"></style>
