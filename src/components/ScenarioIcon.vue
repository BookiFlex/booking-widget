<template>
  <div v-if="kind === 'adults'" class="icons">
    <MaterialIcon v-show="main === 2" title="Main bed(s)">person</MaterialIcon>
    <i v-show="main > 2"
      ><MaterialIcon title="Main bed(s)">person</MaterialIcon>{{ main }}</i
    >
    <MaterialIcon title="Main bed(s)">person</MaterialIcon>
    <template v-if="extraBed">
      <MaterialIcon>add</MaterialIcon>
      <MaterialIcon title="Extra bed(s)">person_outline</MaterialIcon>
    </template>
  </div>

  <span v-else-if="kind === 'child'" class="scenario-text">Adults + children</span>

  <div v-else class="icons" title="Main bed(s) + Extra bed">
    <MaterialIcon>people</MaterialIcon>
    <MaterialIcon>add</MaterialIcon>
    <MaterialIcon>people_outline</MaterialIcon>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import MaterialIcon from '@/components/ui/MaterialIcon.vue'
defineProps({
  kind: {
    type: String,
    required: true,
  },
  main: {
    type: Number,
    required: true,
  },
  extraBed: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss">
@forward '../assets/css/scenario-icon.scss';
</style>
