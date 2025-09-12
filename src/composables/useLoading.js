import { ref } from 'vue'

export function useLoading(initialValue = false) {
  const loading = ref(initialValue)
  const error = ref(null)

  const withLoading = async (fn) => {
    loading.value = true
    error.value = null
    try {
      const result = await fn()
      return result
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    withLoading
  }
}
