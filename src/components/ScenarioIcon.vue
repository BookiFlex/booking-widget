<script setup>
import { defineProps } from 'vue'
import Icon from '@/components/ui/Icon.vue'
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


<template>
  <div v-if="kind === 'adults'" class="icons">
    <Icon v-show="main === 2" title="Main bed(s)" name="Person"></Icon>
    <i v-show="main > 2"
      ><Icon name="Person" title="Main bed(s)"></Icon>{{ main }}</i
    >
    <Icon name="Person" title="Main bed(s)"></Icon>
    <template v-if="extraBed">
      <Icon name="Add">add</Icon>
      <Icon name="PersonOutline" title="Extra bed(s)"></Icon>
    </template>
  </div>

  <span v-else-if="kind === 'child'" class="scenario-text">Adults + children</span>

  <div v-else class="icons" title="Main bed(s) + Extra bed">
    <Icon name="People"></Icon>
    <Icon name="Add"></Icon>
    <Icon name="PeopleOutline"></Icon>
  </div>
</template>

<style lang="scss">
</style>
