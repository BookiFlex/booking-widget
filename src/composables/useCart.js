import { ref, computed } from 'vue'
import { cartService } from '../services/cart.service.js'
import { useLoading } from './useLoading.js'

export function useCart() {
  const cart = ref(null)
  const { loading, error, withLoading } = useLoading()

  const isEmpty = computed(() => !cart.value?.items?.length)
  const itemsCount = computed(() => cart.value?.itemsCount || 0)
  const totalQuantity = computed(() => cart.value?.totalQuantity || 0)
  const firstItem = computed(() => cartService.getFirstItem(cart.value))
  const lengthOfStay = computed(() => cartService.calculateLengthOfStay(cart.value))
  const accommodationUnits = computed(() => cartService.calculateAccommodationUnits(cart.value))

  const loadCart = async () => {
    cart.value = await withLoading(() => cartService.loadCart())
    return cart.value
  }

  const addToCart = async (item) => {
    cart.value = await withLoading(() => cartService.addItem(item))
    return cart.value
  }

  const removeFromCart = async (hash) => {
    cart.value = await withLoading(() => cartService.removeItem(hash))
    return cart.value
  }

  const changePaymentType = async (itemHash, paymentType) => {
    cart.value = await withLoading(() =>
      cartService.changePaymentType(itemHash, paymentType)
    )
    return cart.value
  }

  const confirmCart = async (customerData, specialRequest, arrivalTime) => {
    const result = await withLoading(() =>
      cartService.confirm(customerData, specialRequest, arrivalTime)
    )
    return result
  }

  return {
    cart,
    loading,
    error,
    isEmpty,
    itemsCount,
    totalQuantity,
    firstItem,
    lengthOfStay,
    accommodationUnits,
    loadCart,
    addToCart,
    removeFromCart,
    changePaymentType,
    confirmCart
  }
}
