<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
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
    type: Boolean,
    default: false,
  },
})
const { t } = useI18n()
</script>

<template>
  <div v-if="kind === 'adults'" class="icons">
    <BflexIcon v-show="main === 2" :title="t('ratePlan.scenario.mainBeds')" name="Person"></BflexIcon>
    <i v-show="main > 2"
      ><BflexIcon name="Person" :title="t('ratePlan.scenario.mainBeds')"></BflexIcon>{{ main }}</i
    >
    <BflexIcon name="Person" :title="t('ratePlan.scenario.mainBeds')"></BflexIcon>
    <template v-if="extraBed">
      <BflexIcon name="Add">add</BflexIcon>
      <BflexIcon name="PersonOutline" :title="t('ratePlan.scenario.extraBeds')"></BflexIcon>
    </template>
  </div>

  <span v-else-if="kind === 'child'" class="scenario-text">{{ t('ratePlan.scenario.family') }}</span>

  <div v-else class="icons" :title="t('ratePlan.scenario.mainExtraBeds')">
    <BflexIcon name="People"></BflexIcon>
    <BflexIcon name="Add"></BflexIcon>
    <BflexIcon name="PeopleOutline"></BflexIcon>
  </div>
</template>

<style lang="scss">
</style>
