<script setup>
import { provide, ref } from 'vue'
import BflexInformationBlock from '@/components/InformationBlock/BflexInformationBlock.vue'
import BflexContent from '@/components/InformationBlock/BflexContent.vue'

const t = {
  globalErrorTitle: window.wp.i18n.__('Something went wrong', 'bookiflex'),
  globalErrorDescription: window.wp.i18n.__('An unexpected error occurred. Please try again.', 'bookiflex'),
  globalErrorReload: window.wp.i18n.__('Reload page', 'bookiflex')
}

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
        <h1>{{ t.globalErrorTitle }}</h1>
        <p>{{ t.globalErrorDescription }}</p>
        <button class="button" @click="reload">{{ t.globalErrorReload }}</button>
      </section>
    </BflexContent>
  </BflexInformationBlock>
</template>

<style scoped lang="scss"></style>
