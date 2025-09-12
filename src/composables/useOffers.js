import { ref } from 'vue'
import { offersService } from '../services/offers.service.js'
import { useLoading } from './useLoading.js'

export function useOffers() {
  const offers = ref([])
  const stayPeriod = ref(null)
  const { loading, error, withLoading } = useLoading()

  const loadOffers = async (startDate, endDate, promoCode = null) => {
    if (!startDate || !endDate) return []

    console.log('{ startDate, endDate }', { startDate, endDate })
    stayPeriod.value = { startDate, endDate }
    console.log('{ stayPeriod }', stayPeriod.value)
    offers.value = await withLoading(() =>
      offersService.loadOffers(startDate, endDate, promoCode)
    )
    return offers.value
  }

  return {
    offers,
    loading,
    error,
    stayPeriod,
    loadOffers
  }
}
