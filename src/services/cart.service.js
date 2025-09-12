import { updateCart as apiUpdateCart, loadCart as apiLoadCart, removeFromCart as apiRemoveFromCart, confirmCart as apiConfirmCart, changePaymentType as apiChangePaymentType } from '../api/api.js'

class CartService {
  async loadCart() {
    const response = await apiLoadCart()
    return this.transformCart(response.cart)
  }

  async addItem(item) {
    const response = await apiUpdateCart(item)
    return this.transformCart(response.cart)
  }

  async removeItem(hash) {
    const response = await apiRemoveFromCart(hash)
    return this.transformCart(response.cart)
  }

  async changePaymentType(itemHash, paymentTypeId) {
    const response = await apiChangePaymentType({
      itemHash,
      paymentTypeId
    })
    return this.transformCart(response.cart)
  }

  async confirm(customerData, specialRequest, arrivalTime) {
    const response = await apiConfirmCart({
      customer: customerData,
      specialRequest,
      arrivalTime
    })
    return response
  }

  transformCart(rawCart) {
    if (!rawCart) return null

    return {
      ...rawCart,
      // Убеждаемся что items - это массив
      items: Array.isArray(rawCart.items) ? rawCart.items : [],
      isEmpty: !rawCart.items || rawCart.items.length === 0,
      itemsCount: rawCart.items ? rawCart.items.length : 0,
      totalQuantity: rawCart.items ? rawCart.items.reduce((acc, item) => acc + item.quantity, 0) : 0
    }
  }

  getFirstItem(cart) {
    return cart?.items?.[0] || null
  }

  calculateLengthOfStay(cart) {
    const firstItem = this.getFirstItem(cart)
    return firstItem?.details?.accommodation?.lengthOfStay || 0
  }

  calculateAccommodationUnits(cart) {
    if (!cart?.items) return 0
    return cart.items.reduce((acc, item) => acc + item.quantity, 0)
  }
}

export const cartService = new CartService()
