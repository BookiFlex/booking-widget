<template>
  <div v-if="kind === 'adults'" class="icons">
    <span v-show="main === 2" class="material-icons" title="Main bed(s)">person</span>
    <i v-show="main > 2"><span class="material-icons" title="Main bed(s)">person</span>{{ main }}</i>
    <span class="material-icons" title="Main bed(s)">person</span>
    <template v-if="extraBed">
      <span class="material-icons">add</span>
      <span class="material-icons" title="Extra bed(s)">person_outline</span>
    </template>
  </div>

  <span v-else-if="kind === 'child'" class="scenario-text">Adults + children</span>

  <div v-else class="icons" title="Main bed(s) + Extra bed">
    <span class="material-icons">people</span>
    <span class="material-icons">add</span>
    <span class="material-icons">people_outline</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  kind: {
    type: String,
    required: true
  },
  main: {
    type: Number,
    required: true
  },
  extraBed: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang="scss">
@import "../assets/css/scenario-icon.scss";
</style>
