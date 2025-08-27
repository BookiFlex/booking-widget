
import { ref, watch, provide, inject, toRaw, onMounted, onUnmounted } from 'vue';
import {
  init as apiInit,
  loadOffers as apiLoadOffers,
  updateCart as apiUpdateCart,
  loadCart as apiLoadCart,
  changePaymentType as apiChangePaymentType,
  removeFromCart as apiRemoveFromCart,
  confirmCart as apiConfirmCart,
  loadReservation as apiLoadReservation,
  cancelReservation as apiCancelReservation,
} from '@/api/api.js';
import i18n from '@/i18n';
import {
  CHOOSE_ACCOMMODATION,
  BOOKING_CONFIRMATION,
  EMPTY_CART,
  RESERVATION_DETAILS,
  CANCEL_RESERVATION,
} from '@/constants.js';

let isInitialized = false;

const pages = [CHOOSE_ACCOMMODATION, BOOKING_CONFIRMATION, RESERVATION_DETAILS];

const settings = ref({
  hotelRules: {
    rules: [],
    agreements: [],
  },
  policies: {
    arrivalPolicy: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
    },
  },
});

const activePage = ref(null);
const container = ref(null);
const loading = ref(false);
const sid = ref(null);
const searchParams = ref({});
const cancelReservationSid = ref(null);
const accommodationOffers = ref([]);
const loadingAccommodationOffers = ref(false);
const addingToCart = ref(false);
const cart = ref(null);
const loadingCart = ref(true);
const reservation = ref(null);
const loadingReservation = ref(true);
const cancelationData = ref(null);
const loadingCancelation = ref(true);

const nextPage = (action) => {
  if (!action) {
    activePage.value = CHOOSE_ACCOMMODATION;
  } else if (action === CANCEL_RESERVATION) {
    activePage.value = CANCEL_RESERVATION;
  } else {
    const index = pages.indexOf(action);
    if (index >= 0 && index < pages.length - 1) {
      activePage.value = pages[index + 1];
    }
  }

  if (container.value) {
    container.value.scrollTop = 0;
  }

  window.dispatchEvent(
    new CustomEvent('bflex:booking-widget:action', { detail: { action: activePage.value } }),
  );
};

const onReleasedAction = ({ action, result }) => {
  if (action === EMPTY_CART) {
    nextPage();
  } else if (action === BOOKING_CONFIRMATION) {
    sid.value = result.reservations[0];
    nextPage(action);
  } else {
    nextPage(action);
  }
};

function moveEmptyRatePlansToBottom(items) {
  return [
    ...items.filter((item) => item.ratePlans && item.ratePlans.length > 0),
    ...items.filter((item) => !item.ratePlans || item.ratePlans.length === 0),
  ];
}

const onAddToCart = async ({ accommodationOffer, ratePlan, variant }) => {
  addingToCart.value = true;

  try {
    const result = await apiUpdateCart({
      type: 'accommodation',
      checkInDate: searchParams.value.start,
      checkOutDate: searchParams.value.end,
      accommodationTypeId: accommodationOffer.accommodationType.id,
      ratePlanId: ratePlan.id,
      adults: variant.occupancyOptions.main + variant.occupancyOptions.extraBed,
      children: [],
      quantity: 1,
    });
    onReleasedAction({ action: CHOOSE_ACCOMMODATION, cart: result.cart });
  } catch (error) {
    const { setError } = inject('globalError');
    setError(error);
  } finally {
    addingToCart.value = false;
  }
};

async function loadCart() {
  loadingCart.value = true;
  try {
    const result = await apiLoadCart();
    cart.value = result.cart;
  } catch (error) {
    const { setError } = inject('globalError');
    setError(error);
  } finally {
    loadingCart.value = false;
  }
}

async function changePaymentType(paymentType) {
  try {
    const result = await apiChangePaymentType({
      request: Object.keys(cart.value.items)[0],
      paymentType,
    });
    cart.value = result.cart;
  } catch (error) {
    const { setError } = inject('globalError');
    setError(error);
  }
}

async function removeFromCart(hash) {
  loading.value = true;
  try {
    const result = await apiRemoveFromCart(hash);
    cart.value = result.cart;
    if (result.cart.items.length === 0) {
      onReleasedAction({ action: EMPTY_CART, result });
    }
  } catch (error) {
    const { setError } = inject('globalError');
    setError(error);
  } finally {
    loading.value = false;
  }
}

async function confirmCart(data) {
  loading.value = true;
  try {
    const result = await apiConfirmCart(data);
    if (result && result.reservations) {
      onReleasedAction({ action: BOOKING_CONFIRMATION, result });
    }
  } catch (error) {
    const { setError } = inject('globalError');
    setError(error);
  } finally {
    loading.value = false;
  }
}

async function loadReservation(sid) {
  if (!sid) return;
  loadingReservation.value = true;
  try {
    const result = await apiLoadReservation({ sid });
    reservation.value = result.data;
  } catch (error) {
    const { setError } = inject('globalError');
    setError(error);
  } finally {
    loadingReservation.value = false;
  }
}

async function loadCancelation(sid) {
  if (!sid) return;
  loadingCancelation.value = true;
  try {
    const result = await apiLoadReservation({ sid: atob(sid) });
    cancelationData.value = result.data;
  } catch (error) {
    const { setError } = inject('globalError');
    setError(error);
  } finally {
    loadingCancelation.value = false;
  }
}

async function cancel(sid, code) {
  return await apiCancelReservation({ sid: atob(sid), code });
}

export function useBooking(props) {
  provide('settings', settings);

  if (!isInitialized) {
    isInitialized = true;

    const { setError } = inject('globalError');

    const onSearchParamsChanged = (e) => {
      const { start, end, promoCode } = e.detail;
      searchParams.value = { start, end, promoCode };
      e.stopPropagation();
    };

    onMounted(async () => {
      window.dispatchEvent(new CustomEvent('bflex:booking-widget:ready'));
      window.addEventListener('bflex:search-bar:search', onSearchParamsChanged);

      loading.value = true;
      try {
        const { inProgress, settings: appSettings } = await apiInit();
        settings.value = appSettings;
        const { widget } = appSettings;

        if (widget && widget.locale && widget.l10n && Object.keys(widget.l10n).length) {
          i18n.global.locale.value = widget.locale;
          i18n.global.setLocaleMessage(widget.locale, widget.l10n);
        }

        const params = new URLSearchParams(window.location.search);

        if (params.has('cancelReservation')) {
          cancelReservationSid.value = params.get('cancelReservation');
          nextPage(CANCEL_RESERVATION);
        } else {
          inProgress ? nextPage(CHOOSE_ACCOMMODATION) : nextPage();
        }
      } catch (error) {
        setError(error);
      } finally {
        setTimeout(() => {
          loading.value = false;
        }, 1000);
      }
    });

    onUnmounted(() => {
      window.removeEventListener('bflex:search-bar:search', onSearchParamsChanged);
    });

    watch(
      searchParams,
      async (value, prevValue) => {
        if (!value.start || !value.end) {
          return;
        }

        if (
          !prevValue ||
          !prevValue.start ||
          !prevValue.end ||
          prevValue.start !== value.start ||
          prevValue.end !== value.end
        ) {
          window.dispatchEvent(
            new CustomEvent('bflex:booking-widget:changed', { detail: toRaw(searchParams.value) }),
          );

          loadingAccommodationOffers.value = true;
          try {
            const result = await apiLoadOffers(value.start, value.end, searchParams.value.promoCode);
            accommodationOffers.value = moveEmptyRatePlansToBottom(result.searchResults);
          } catch (error) {
            setError(error);
          } finally {
            loadingAccommodationOffers.value = false;
          }
        }
      },
      {
        immediate: true,
        deep: true,
      },
    );
  }

  if (props) {
    searchParams.value = {
      start: props.start,
      end: props.end,
      promoCode: props.promoCode,
    };

    watch(
      () => ({ start: props.start, end: props.end, promoCode: props.promoCode }),
      () => {
        searchParams.value = {
          start: props.start,
          end: props.end,
          promoCode: props.promoCode,
        };
      },
    );
  }

  return {
    // state
    settings,
    activePage,
    loading,
    sid,
    searchParams,
    container,
    cancelReservationSid,
    accommodationOffers,
    loadingAccommodationOffers,
    addingToCart,
    cart,
    loadingCart,
    reservation,
    loadingReservation,
    cancelationData,
    loadingCancelation,

    // methods
    nextPage,
    onReleasedAction,
    onAddToCart,
    loadCart,
    changePaymentType,
    removeFromCart,
    confirmCart,
    loadReservation,
    loadCancelation,
    cancel,
  };
}
