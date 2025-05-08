<script setup>
import { provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BflexInformationBlock from '@/components/InformationBlock/BflexInformationBlock.vue'
import BflexContent from '@/components/InformationBlock/BflexContent.vue'

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
  <BflexInformationBlock v-else>
    <BflexContent>
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
    </BflexContent>
  </BflexInformationBlock>
</template>

<style scoped lang="scss"></style>
