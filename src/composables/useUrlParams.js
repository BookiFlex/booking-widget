import { ref } from 'vue'

/**
 * Composable for reading and writing URL parameters
 *
 * @param {Object} options - Configuration options
 * @param {Boolean} options.enabled - Enable URL parameter reading/writing
 * @returns {Object} - URL params helpers
 */
export function useUrlParams(options = {}) {
  const { enabled = false } = options

  const urlParams = ref(null)

  /**
   * Read URL parameters from window.location.search
   * @returns {Object|null} - Parsed URL parameters or null if disabled/empty
   */
  const readUrlParams = () => {
    if (!enabled) return null

    const params = new URLSearchParams(window.location.search)
    const result = {}

    // Read marketing and search parameters only
    // Note: 'cancel' is handled separately in BookingWidget.vue (always checked)
    const start = params.get('start')
    const end = params.get('end')
    const promoCode = params.get('promoCode')
    const accommodationTypes = params.get('accommodationTypes')
    const ratePlans = params.get('ratePlans')

    // Only include parameters that are present
    if (start) result.start = start
    if (end) result.end = end
    if (promoCode) result.promoCode = promoCode
    if (accommodationTypes) result.accommodationTypes = accommodationTypes
    if (ratePlans) result.ratePlans = ratePlans

    return Object.keys(result).length > 0 ? result : null
  }

  /**
   * Update URL with new parameters using History API
   * @param {Object} params - Parameters to set in URL
   */
  const updateUrl = (params) => {
    if (!enabled) return

    const url = new URL(window.location)

    // Update or remove parameters
    if (params.start) {
      url.searchParams.set('start', params.start)
    } else {
      url.searchParams.delete('start')
    }

    if (params.end) {
      url.searchParams.set('end', params.end)
    } else {
      url.searchParams.delete('end')
    }

    if (params.promoCode) {
      url.searchParams.set('promoCode', params.promoCode)
    } else {
      url.searchParams.delete('promoCode')
    }

    if (params.accommodationTypes) {
      url.searchParams.set('accommodationTypes', params.accommodationTypes)
    } else {
      url.searchParams.delete('accommodationTypes')
    }

    if (params.ratePlans) {
      url.searchParams.set('ratePlans', params.ratePlans)
    } else {
      url.searchParams.delete('ratePlans')
    }

    // Use replaceState to avoid creating history entries
    window.history.replaceState({}, '', url)
  }

  /**
   * Clear all booking-related parameters from URL
   */
  const clearUrlParams = () => {
    if (!enabled) return

    const url = new URL(window.location)
    url.searchParams.delete('start')
    url.searchParams.delete('end')
    url.searchParams.delete('promoCode')
    url.searchParams.delete('accommodationTypes')
    url.searchParams.delete('ratePlans')

    window.history.replaceState({}, '', url)
  }

  // Initialize urlParams if enabled
  if (enabled) {
    urlParams.value = readUrlParams()
  }

  return {
    urlParams,
    readUrlParams,
    updateUrl,
    clearUrlParams,
  }
}
