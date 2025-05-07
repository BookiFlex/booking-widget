const ENDPOINTS = {
  INIT: 'bflex/v1/cart/init',
  OFFERS: 'bflex/v1/offers',
  CART: 'bflex/v1/cart',
  CHANGE_PAYMENT_TYPE: 'bflex/v1/cart/paymentType',
  CONFIRM_CART: 'bflex/v1/cart/confirm',
  LOAD_RESERVATION: 'bflex/v1/account/reservation'
}

/**
 * Handles API responses according to the standard format
 * @param {Response} response - Fetch Response object
 * @returns {Promise<*>} - The result data on success
 * @throws {Error} - Throws an error with the API error message on failure
 */
async function handleResponse(response) {
  let data = null

  // Try to parse JSON
  try {
    data = await response.json()
    // eslint-disable-next-line no-unused-vars
  } catch (_) {
    const error = new Error('Invalid JSON in response')
    error.code = 'invalid_json'
    error.status = response.status
    throw error
  }

  if (response.ok && data.status === 'success') {
    return data.result
  }

  const errorMessage = data.message || 'Unknown API error'
  const errorCode = data.code || 'api_error'

  const error = new Error(errorMessage)
  error.code = errorCode
  error.data = data.data
  error.status = response.status
  throw error
}

/**
 * Return WP RestAPI url
 * @returns {Promise<*|string>}
 */
async function detectRestApiRelativeUrl() {
  if (window.BookiFlex?.restUrl) {
    return toRelativeUrl(window.BookiFlex.restUrl);
  }

  const apiLink = document.querySelector('link[rel="https://api.w.org/"]');
  if (apiLink?.href) {
    return toRelativeUrl(apiLink.href);
  }

  try {
    const res = await fetch('/wp-json/', { method: 'HEAD' });
    if (res.ok) return '/wp-json/';
    // eslint-disable-next-line no-unused-vars
  } catch (_) {
    //
  }

  return '/index.php?rest_route=/';
}

function toRelativeUrl(absoluteUrl) {
  try {
    const url = new URL(absoluteUrl, location.href);
    return url.pathname + url.search; // for ex.: /wp-json/ or /index.php?rest_route=/
    // eslint-disable-next-line no-unused-vars
  } catch (_) {
    return absoluteUrl; // fallback, если URL кривой
  }
}

const init = async () => {
  const endpoint = await detectRestApiRelativeUrl() + ENDPOINTS.INIT

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
    console.error('Error in init app', error);
    throw error
  }
}

const loadOffers = async (start, end, promoCode) => {
  console.debug('Loading data', start, end, promoCode)
  const endpoint = await detectRestApiRelativeUrl() + ENDPOINTS.OFFERS + '?'

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

const loadCart = async () => {
  console.debug('Loading cart')
  const endpoint = await detectRestApiRelativeUrl() + ENDPOINTS.CART

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
  const endpoint = await detectRestApiRelativeUrl() + ENDPOINTS.CART

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
  const endpoint = await detectRestApiRelativeUrl() + ENDPOINTS.CHANGE_PAYMENT_TYPE

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
  const endpoint = await detectRestApiRelativeUrl() + ENDPOINTS.CONFIRM_CART

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
  const endpoint = await detectRestApiRelativeUrl() + ENDPOINTS.LOAD_RESERVATION

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
