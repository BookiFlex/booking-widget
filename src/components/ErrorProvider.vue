<script setup>
import { provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import InformationBlock from '@/components/InformationBlock/InformationBlock.vue'
import Content from '@/components/InformationBlock/Content.vue'

const { t } = useI18n()
const error = ref(null)

const setError = (err) => {
  error.value = err
}
const clearError = () => {
  error.value = null
}

provide('globalError', { setError, clearError })

const reload = () => {
  location.reload()
}
</script>

<template>
  <slot v-if="!error" />
  <InformationBlock v-else>
    <Content>
      <section
        style="
          display: flex;
          flex-direction: column;
          min-height: 300px;
          justify-content: center;
          align-items: center;
        "
      >
        <h1>{{ t('globalError.title') }}</h1>
        <p>{{ t('globalError.description') }}</p>
        <button class="button" @click="reload">{{ t('globalError.reload') }}</button>
      </section>
    </Content>
  </InformationBlock>
</template>

<style scoped lang="scss"></style>
