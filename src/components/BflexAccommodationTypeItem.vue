<script setup>
import { defineProps, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BflexImageGallery from './ui/BflexImageGallery.vue'

defineProps({
  /**
   * @type {{
   *   name: string,
   *   description: string,
   *   thumbnail: {
   *     url: string,
   *     name: string
   *   } | null,
   *   gallery: Array<{
   *      src: string,
   *      title: string,
   *      description: string
   *      }>,
   *   amenities: Array<{
   *     title: string
   *   }>
   * }}
   */
  data: {
    type: Object,
    default: () => ({
        name: '',
        description: '',
        thumbnail: null,
        gallery: [],
        amenities: []
    })
  },
})

const { t } = useI18n()

const isOpen = ref(false)
const openGallery = () => {
  isOpen.value = true
}
</script>

<template>
  <article class="accommodation-type-card">
    <section @click="openGallery" class="accommodation-type-card__img">
      <BflexImageGallery v-model="isOpen" :images="data.gallery">
        <img
          v-if="data.thumbnail && data.thumbnail.url"
          @click="openGallery"
          :src="data.thumbnail.url"
          :alt="data.thumbnail.name"
        />
        <span v-else>{{ t('accommodationType.thumbnail') }}</span>
      </BflexImageGallery>
    </section>

    <section class="accommodation-type-card__body">
      <div class="accommodation-type-card__body-description">
        <h2>{{ data.name }}</h2>
        <slot name="description">
          <p>{{ data.description }}</p>
        </slot>

        <div class="amenities">
          <span v-for="(amenity, index) in data.amenities" :key="index" class="amenities__item">{{ amenity.title }}</span>
        </div>
      </div>
    </section>
  </article>
</template>

<style lang="scss">
</style>
