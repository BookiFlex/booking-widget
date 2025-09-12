import { loadOffers as apiLoadOffers } from '../api/api.js'

class OffersService {
  async loadOffers(startDate, endDate, promoCode = null) {
    const response = await apiLoadOffers(startDate, endDate, promoCode)
    return this.transformOffers(response.searchResults)
  }

  transformOffers(offers) {
    // Сортируем: сначала с тарифными планами, потом без
    return [
      ...offers.filter(item => item.ratePlans?.length > 0),
      ...offers.filter(item => !item.ratePlans?.length)
    ]
  }
}

export const offersService = new OffersService()
