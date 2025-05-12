<script setup>
import { onMounted, onBeforeUnmount, watch, defineProps, defineEmits } from 'vue'
import GLightbox from 'glightbox'

const props = defineProps({
  images: Array, // List of images [{ src: "...", title: "...", description: "..." }]
  modelValue: Boolean, // Open/close state
})

const emit = defineEmits(['update:modelValue'])

let lightbox = null

onMounted(() => {
  lightbox = GLightbox({
    elements: props.images.map((img) => ({
      href: img.url,
      type: 'image',
      title: img.title || '',
      description: img.description || '',
    })),
    openEffect: 'zoom', // Анимация открытия
    closeEffect: 'fade', // Анимация закрытия
    touchNavigation: true,
  })

  if (props.modelValue) {
    lightbox.open()
  }

  // Закрытие ловим через событие GLightbox
  lightbox.on('close', () => {
    emit('update:modelValue', false)
  })
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      lightbox.open()
    } else {
      lightbox.close()
    }
  },
)

onBeforeUnmount(() => {
  if (lightbox) {
    lightbox.destroy()
  }
})
</script>

<template>
  <slot></slot>
</template>

<style lang="scss"></style>
