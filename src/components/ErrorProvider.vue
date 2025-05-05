<script setup>
import { provide, ref } from 'vue'
import InformationBlock from '@/components/InformationBlock/InformationBlock.vue'
import Content from '@/components/InformationBlock/Content.vue'

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
      <section style="display: flex; flex-direction: column; min-height: 300px; justify-content: center; align-items: center;">
        <h1>Sorry, something went wrong</h1>
        <p>We couldn't load the data. Please try refreshing the page or come back later.</p>
        <button class="button" @click="reload">Reload</button>
      </section>
    </Content>
  </InformationBlock>
</template>

<style scoped lang="scss"></style>
