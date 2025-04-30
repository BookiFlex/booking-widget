/**
 * Handles API responses according to the standard format
 * @param {Response} response - Fetch Response object
 * @returns {Promise<*>} - The result data on success
 * @throws {Error} - Throws an error with the API error message on failure
 */
const handleResponse = async (response) => {
  const data = await response.json()

  // Success case - return the result directly
  if (response.ok && data.status === 'success') {
    return data.result
  }

  // Error case - throw an error with details from the response
  const errorMessage = data.message || 'Unknown API error'
  const errorCode = data.code || 'api_error'
  const error = new Error(errorMessage)
  error.code = errorCode
  error.data = data.data
  error.status = response.status
  throw error
}

const loadOffers = async (start, end, promoCode) => {
  console.debug('Loading data', start, end, promoCode)
  const endpoint = '/wp-json/bflex/v1/offers?'

  if (!start || !end) {
    throw new Error('Invalid dates')
  }

  const url = `${endpoint}checkInDate=${start}&checkOutDate=${end}&promoCode=${promoCode || ''}`

  try {
    const response = await fetch(url)
    return await handleResponse(response)
  } catch (error) {
    console.error('Failed to load offers:', error)
    throw error
  }
}

const init = async () => {
  const endpoint = '/wp-json/bflex/v1/cart/init'

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request: {} }),
    })

    return await handleResponse(response)
  } catch (error) {
    console.error('Failed to initialize cart:', error)
    throw error
  }
}

const loadCart = async () => {
  console.debug('Loading cart')
  const endpoint = '/wp-json/bflex/v1/cart'

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request: {} }),
    })

    return await handleResponse(response)
  } catch (error) {
    console.error('Failed to load cart:', error)
    throw error
  }
}

/**
 * {
 *     "request": {
 *         "checkInDate": "2024-12-03",
 *         "checkOutDate": "2024-12-06",
 *         "accommodationType": 272,
 *         "ratePlan": 284,
 *         "adults": 1,
 *         "children": [],
 *         "quantity": 2
 *     }
 * }
 * @param data
 * @returns {Promise<void>}
 */
const updateCart = async (data) => {
  console.debug('Booking offer', data)
  const endpoint = '/wp-json/bflex/v1/cart'

  try {
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request: data }),
    })

    return await handleResponse(response)
  } catch (error) {
    console.error('Failed to add to cart:', error)
    throw error
  }
}

/**
 * {
 *     "request": "requestHash",
 *     "paymentType": 277
 * }
 * @param data
 * @returns {Promise<void>}
 */
const changePaymentType = async (data) => {
  const endpoint = '/wp-json/bflex/v1/cart/paymentType'

  try {
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return await handleResponse(response)
  } catch (error) {
    console.error('Failed to change payment type:', error)
    throw error
  }
}

/**
 *     "customer": {
 *         "email": "test@test.com",
 *         "firstName": "Alex",
 *         "lastName": "Daw"
 *     },
 *     "paymentType": 277
 *
 * @param data
 * @returns {Promise<Object>}
 */
const confirmCart = async (data) => {
  console.debug('Confirming booking', data)
  const endpoint = '/wp-json/bflex/v1/cart/confirm'

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return await handleResponse(response)
  } catch (error) {
    console.error('Failed to confirm booking:', error)
    throw error
  }
}

/**
 * Load reservation details by SID
 * @param {Object} data - Contains reservation SID
 * @returns {Promise<Object>}
 */
const loadReservation = async (data) => {
  const endpoint = '/wp-json/bflex/v1/account/reservation'

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return await handleResponse(response)
  } catch (error) {
    console.error('Failed to load reservation:', error)
    throw error
  }
}

export { init, loadOffers, loadCart, updateCart, changePaymentType, confirmCart, loadReservation }
