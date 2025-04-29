<script setup>
import {defineProps, ref} from 'vue';
import Gallery from "./ui/Gallery.vue";

defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      code: '',
      name: '',
      description: '',
      content: '',
      thumbnail: {
        url: '',
        name: ''
      },
      gallery: [],
      amenities: []
    })
  }
});

const isOpen = ref(false);
const openGallery = () => {
  isOpen.value = true;
};
</script>

<template>
  <section class="accommodation-type-card">
    <section @click="openGallery" class="accommodation-type-card__img">
      <Gallery v-model="isOpen" :images="data.gallery">
        <img v-if="data.thumbnail && data.thumbnail.url" @click="openGallery" :src="data.thumbnail.url" :alt="data.thumbnail.name">
        <span v-else>Thumbnail</span>
      </Gallery>
    </section>

    <section class="accommodation-type-card__body">
      <div class="description">
        <h3>{{ data.name }}</h3>
        <slot name="description">
          <p>{{ data.description }}</p>
        </slot>

        <div class="amenities">
          <span v-for="amenity in data.amenities">{{ amenity.title }}</span>
        </div>
      </div>

      <div class="accommodation-type-card__bottom">
        <div class="accommodation-type-card__bottom-left">
          <slot name="footerLeft"></slot>
        </div>

        <div class="accommodation-type-card__bottom-right">
          <!-- Предварительно загружать кешированные минимальные цены за 1 ночь, в период - ближайшие 14 дней -->
          <!-- Как загрузятся реальные варианты, то заменять на мин из ТП -->
          <slot name="footerRight" />
        </div>
      </div>
    </section>
  </section>
</template>

<style lang="scss">

</style>
