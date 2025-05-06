<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
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
const { t } = useI18n()
</script>

<template>
  <div v-if="kind === 'adults'" class="icons">
    <Icon v-show="main === 2" :title="t('ratePlan.scenario.mainBeds')" name="Person"></Icon>
    <i v-show="main > 2"
      ><Icon name="Person" :title="t('ratePlan.scenario.mainBeds')"></Icon>{{ main }}</i
    >
    <Icon name="Person" :title="t('ratePlan.scenario.mainBeds')"></Icon>
    <template v-if="extraBed">
      <Icon name="Add">add</Icon>
      <Icon name="PersonOutline" :title="t('ratePlan.scenario.extraBeds')"></Icon>
    </template>
  </div>

  <span v-else-if="kind === 'child'" class="scenario-text">{{ t('ratePlan.scenario.family') }}</span>

  <div v-else class="icons" :title="t('ratePlan.scenario.mainExtraBeds')">
    <Icon name="People"></Icon>
    <Icon name="Add"></Icon>
    <Icon name="PeopleOutline"></Icon>
  </div>
</template>

<style lang="scss">
</style>
