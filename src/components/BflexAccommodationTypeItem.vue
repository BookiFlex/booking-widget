<script setup>
import { ref, computed } from 'vue'
import BflexImageGallery from './ui/BflexImageGallery.vue'

const props = defineProps({
  /**
   * @type {{
   *   name: string,
   *   description: string,
   *   address?: string,
   *   longitude?: string,
   *   latitude?: string,
   *   thumbnail: {
   *     url: string,
   *     name: string,
   *     sizes?: { card?: string, gallery?: string, full?: string }
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
      address: '',
      longitude: '',
      latitude: '',
      thumbnail: null,
      gallery: [],
      amenities: [],
    }),
  },
  roomQuantity: Number,
})

const t = {
  thumbnail: window.wp.i18n.__('No image available', 'bookiflex'),
  roomQuantity: window.wp.i18n.__('Available', 'bookiflex')
}

const thumbnailSrcset = computed(() => {
  const sizes = props.data?.thumbnail?.sizes
  if (!sizes) return undefined
  const parts = []
  if (sizes.card?.url && sizes.card.width) parts.push(`${sizes.card.url} ${sizes.card.width}w`)
  if (sizes.card_lg?.url && sizes.card_lg.width) parts.push(`${sizes.card_lg.url} ${sizes.card_lg.width}w`)
  if (sizes.full?.url && sizes.full.width) parts.push(`${sizes.full.url} ${sizes.full.width}w`)
  return parts.length ? parts.join(', ') : undefined
})

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
          :srcset="thumbnailSrcset"
          sizes="(max-width: 480px) 100vw, 300px"
          :alt="data.thumbnail.name"
          loading="lazy"
        />
        <span v-else>{{ t.thumbnail }}</span>
      </BflexImageGallery>
      <div class="room-quantity">{{ t.roomQuantity }}: {{ roomQuantity }}</div>
    </section>

    <section class="accommodation-type-card__body">
      <div class="accommodation-type-card__body-description">
        <h2>{{ data.name }}</h2>
        <p v-if="data.address && data.address.trim()" class="accommodation-type-card__address">
          {{ data.address }}
        </p>
        <slot name="description">
          <p>{{ data.description }}</p>
        </slot>

        <div class="amenities">
          <span v-for="(amenity, index) in data.amenities" :key="index" class="amenities__item">{{
            amenity
          }}</span>
        </div>
      </div>
    </section>
  </article>
</template>

<style lang="scss"></style>
