import { ref, computed } from 'vue'

export function usePageData() {
  const pageData = ref({})
  const loadingStates = ref({})

  const setPageData = (page, data) => {
    pageData.value[page] = data
  }

  const getPageData = (page) => {
    return pageData.value[page] || null
  }

  const setLoading = (page, isLoading) => {
    loadingStates.value[page] = isLoading
  }

  const isPageLoading = (page) => {
    return loadingStates.value[page] || false
  }

  const clearPageData = (page) => {
    delete pageData.value[page]
    delete loadingStates.value[page]
  }

  return {
    pageData: computed(() => pageData.value),
    setPageData,
    getPageData,
    setLoading,
    isPageLoading,
    clearPageData
  }
}
