import { ref, computed } from 'vue'
import { reservationService } from '../services/reservation.service.js'
import { convertStatus } from '../util/text.js'
import { useLoading } from './useLoading.js'

export function useReservation() {
  const reservation = ref(null)
  const { loading, error, withLoading } = useLoading()

  const statusText = computed(() => {
    if (reservation.value) {
      return convertStatus(reservation.value.status)
    }
    return ''
  })

  const loadReservation = async (sid) => {
    if (!sid) return null

    reservation.value = await withLoading(() =>
      reservationService.loadReservation(sid)
    )
    return reservation.value
  }

  const cancelReservation = async (sid, code) => {
    const result = await withLoading(() =>
      reservationService.cancelReservation(sid, code)
    )
    return result
  }

  return {
    reservation,
    loading,
    error,
    statusText,
    loadReservation,
    cancelReservation
  }
}
