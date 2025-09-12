import { loadReservation as apiLoadReservation, cancelReservation as apiCancelReservation } from '../api/api.js'

class ReservationService {
  async loadReservation(sid, decode = true) {
    const decodedSid = decode ? atob(sid) : sid
    const response = await apiLoadReservation({ sid: decodedSid })
    return this.transformReservation(decodedSid, response.data)
  }

  async cancelReservation(sid, code, decode = true) {
    const decodedSid = decode ? atob(sid) : sid
    const response = await apiCancelReservation({
      sid: decodedSid,
      code
    })
    return response
  }

  transformReservation(sid, data) {
    const reservation = data.reservations.find((reservation) => reservation.sid === sid)
    return {
      ...reservation,
      totals: data.totals ? data.totals : {},
      // Добавляем вычисляемые поля если нужно
      hasPenalties: reservation?.penalties?.total?.amount > 0,
      hasSpecialRequest: !!reservation?.specialRequest
    }
  }
}

export const reservationService = new ReservationService()
