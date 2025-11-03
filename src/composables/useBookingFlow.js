import { ref } from 'vue'
import {
  CHOOSE_ACCOMMODATION,
  BOOKING_CONFIRMATION,
  RESERVATION_DETAILS,
  CANCEL_RESERVATION,
  EMPTY_CART
} from '../constants.js'

export function useBookingFlow() {
  const pages = [CHOOSE_ACCOMMODATION, BOOKING_CONFIRMATION, RESERVATION_DETAILS]
  const activePage = ref(null)
  const reservationSid = ref(null)

  const navigateTo = (page) => {
    activePage.value = page
    window.dispatchEvent(
      new CustomEvent('bflex:booking-widget:action', {
        detail: { action: page }
      })
    )
  }

  const nextPage = (action, result = null) => {
    if (!action) {
      navigateTo(CHOOSE_ACCOMMODATION)
      return
    }

    if (action === CANCEL_RESERVATION) {
      navigateTo(CANCEL_RESERVATION)
      return
    }

    if (action === EMPTY_CART) {
      navigateTo(null)
      return
    }

    if (action === BOOKING_CONFIRMATION && result?.reservations) {
      reservationSid.value = result.reservations[0]
    }

    const index = pages.indexOf(action)
    if (index >= 0 && index < pages.length - 1) {
      navigateTo(pages[index + 1])
    }
  }

  const startCancellation = (sid) => {
    reservationSid.value = sid
    navigateTo(CANCEL_RESERVATION)
  }

  return {
    activePage,
    reservationSid,
    nextPage,
    startCancellation,
    navigateTo
  }
}
