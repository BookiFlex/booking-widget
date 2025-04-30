<script setup>
import { defineProps } from 'vue'
import BookingWidget from './BookingWidget.vue'

const props = defineProps({
  options: String,
})

let optionsData = window.BookiFlex

if (!optionsData) {
  optionsData = JSON.parse(props.options)
}
</script>

<template>
  <BookingWidget :options="optionsData" />
</template>

<style lang="scss">
@forward "floating-vue/dist/style.css";
@forward "glightbox/dist/css/glightbox.css";
@forward "assets/css/material-icons.scss";
@forward "assets/css/loader.scss";
@forward "assets/css/button.scss";
@forward "assets/css/accommodation-offer-block";
@forward "assets/css/accommodation-rules-block";
@forward "assets/css/result-page.scss";
@forward 'assets/css/accommodation-card.scss';
@forward 'assets/css/accommodation-type-card.scss';
@forward 'assets/css/booking-widget.scss';
@forward 'assets/css/checkbox.scss';
@forward 'assets/css/contact-information-block';
@forward 'assets/css/field-decorator.scss';
@forward 'assets/css/summary-block';
@forward 'assets/css/information-block.scss';
@forward 'assets/css/price-block.scss';
@forward 'assets/css/rate-plan-card.scss';
@forward 'assets/css/rate-plan-variant.scss';
@forward 'assets/css/sceleton.scss';
@forward 'assets/css/scenario-icon.scss';
</style>
