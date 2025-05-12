<template>
  <BflexInformationBlock
    class="accommodation-skeleton"
    :class="{ 'accommodation-result': isResult }"
  >
    <!-- Card Header with Thumbnail and Info -->
    <div class="header">
      <!-- Thumbnail Skeleton -->
      <div class="thumbnail"></div>

      <!-- Content Section -->
      <div class="content">
        <!-- Title Skeleton -->
        <div class="title-skeleton"></div>

        <!-- Description Skeleton - 3 lines -->
        <div class="description">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line line-short"></div>
        </div>

        <!-- Amenities Skeleton -->
        <div class="amenities">
          <div v-for="i in 5" :key="i" class="amenity-item"></div>
        </div>
      </div>
    </div>
    <BflexDivider></BflexDivider>

    <!-- Card Footer with Pricing Options -->
    <div class="footer">
      <!-- Base Option Header -->
      <div class="option-header">
        <div class="option-title"></div>
        <div class="option-value"></div>
      </div>

      <BflexDivider></BflexDivider>

      <!-- Room Options - 2 rows -->
      <div v-for="i in 2" :key="i" class="room-option">
        <div class="option-details">
          <div class="option-name"></div>
          <div class="option-description"></div>
        </div>

        <div class="price-section">
          <div class="price"></div>
          <div class="book-button"></div>
        </div>
      </div>
    </div>
  </BflexInformationBlock>
</template>

<script setup>
import BflexInformationBlock from '../InformationBlock/BflexInformationBlock.vue'
import BflexDivider from '../InformationBlock/BflexDivider.vue'
import { defineProps } from 'vue'
defineProps({
  isResult: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped></style>
