<script setup>
import { defineProps } from 'vue'
import BflexIcon from '@/components/ui/BflexIcon.vue'
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
    type: Number,
    default: 0,
  },
})

const t = {
  mainBeds: window.wp.i18n.__('Main beds', 'bookiflex'),
  extraBeds: window.wp.i18n.__('Extra beds', 'bookiflex'),
  family: window.wp.i18n.__('Family room', 'bookiflex'),
  mainExtraBeds: window.wp.i18n.__('Main and extra beds', 'bookiflex')
}
</script>

<template>
  <div v-if="kind === 'adults'" class="icons">
    <BflexIcon
      v-show="main === 2"
      :title="t.mainBeds"
      name="Person"
    ></BflexIcon>
    <span v-show="main > 2">{{ main }}</span>
    <span v-show="main > 2">x</span>
    <BflexIcon name="Person" :title="t.mainBeds"></BflexIcon>

    <template v-if="extraBed">
      <BflexIcon name="Add">add</BflexIcon>
      <BflexIcon
        v-show="extraBed === 2"
        :title="t.extraBeds"
        name="PersonOutline"
      ></BflexIcon>
      <span v-show="extraBed > 2">{{ main }}</span>
      <span v-show="extraBed > 2">x</span>
      <BflexIcon name="PersonOutline" :title="t.extraBeds"></BflexIcon>
    </template>
  </div>

  <span v-else-if="kind === 'child'" class="scenario-text">{{
    t.family
  }}</span>

  <div v-else class="icons" :title="t.mainExtraBeds">
    <BflexIcon name="People"></BflexIcon>
    <BflexIcon name="Add"></BflexIcon>
    <BflexIcon name="PeopleOutline"></BflexIcon>
  </div>
</template>

<style lang="scss"></style>
