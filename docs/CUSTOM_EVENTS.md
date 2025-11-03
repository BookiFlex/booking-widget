# Custom Events Documentation

This document provides a comprehensive overview of the custom events used in the BookiFlex Booking Widget project.

## Table of Contents

- [Emitted Events](#emitted-events)
- [Listened Events](#listened-events)
- [Internal Component Events](#internal-component-events)
- [URL Parameters Integration](#url-parameters-integration)
- [Usage Examples](#usage-examples)

---

## Emitted Events

These are events that are dispatched from the booking widget to the parent window using the native DOM `CustomEvent` API. Parent applications can listen to these events to track the widget's state and user interactions.

### Event List

| Event Name | Emitted From | Description | Event Detail Type |
| :--- | :--- | :--- | :--- |
| `bflex:booking-widget:ready` | `src/BookingWidget.vue` | Fired when the booking widget is mounted and ready to be interacted with. | None |
| `bflex:booking-widget:changed` | `src/BookingWidget.vue` | Fired when the search parameters (start date, end date, promo code) are changed. | `SearchParams` |
| `bflex:booking-widget:action` | `src/composables/useBookingFlow.js` | Fired when the user navigates between different pages of the booking widget. | `ActionDetail` |
| `bflex:booking-widget:removed` | `src/BookingWidget.ce.vue`, `src/App.vue` | Fired when the booking widget is removed from the DOM. | None |

### Event Detail Structures

#### SearchParams

```typescript
interface SearchParams {
  start: string;      // Check-in date in YYYY-MM-DD format
  end: string;        // Check-out date in YYYY-MM-DD format
  promoCode: string | null; // Promotional code if available
}
```

**Example:**
```javascript
{
  start: "2025-01-15",
  end: "2025-01-20",
  promoCode: "WINTER2025"
}
```

#### ActionDetail

```typescript
interface ActionDetail {
  action: string;  // One of: 'choose_accommodation', 'booking_confirmation', 'reservation_details', 'cancel_reservation', or null
}
```

**Example:**
```javascript
{
  action: "booking_confirmation"
}
```

---

## Listened Events

These are events that the booking widget listens for from the parent window. Parent applications can dispatch these events to control the widget's behavior.

### Event List

| Event Name | Listened In | Description | Expected Event Detail |
| :--- | :--- | :--- | :--- |
| `bflex:search-bar:search` | `src/BookingWidget.vue` | Updates the booking widget's search parameters and re-fetches accommodation offers. | `SearchParams` |

### Event Detail Structures

#### SearchParams (for search event)

```typescript
interface SearchParams {
  start: string;      // Check-in date in YYYY-MM-DD format
  end: string;        // Check-out date in YYYY-MM-DD format
  promoCode?: string; // Optional promotional code
}
```

**Example:**
```javascript
{
  start: "2025-02-01",
  end: "2025-02-05",
  promoCode: "SPRING2025"
}
```

---

## Internal Component Events

These events are used for communication between internal components of the booking widget. They are emitted using Vue's `emit()` function and are not exposed to parent applications.

### Event List

| Event Name | Emitted From | Listened In | Description | Payload Type |
| :--- | :--- | :--- | :--- | :--- |
| `released` | `src/pages/OffersPage.vue`, `src/pages/ConfirmationPage.vue`, `src/pages/ResultPage.vue` | `src/BookingWidget.vue` | Fired when a page-level action is completed. | `ReleasedPayload` |
| `variant-chosen` | `src/components/BflexRatePlanItem.vue` | `src/components/BflexAccommodationOfferCard.vue` | Fired when a user selects a rate plan variant. | `RatePlanVariant` |
| `accommodationOfferChosen` | `src/components/BflexAccommodationOfferCard.vue` | `src/pages/OffersPage.vue` | Fired when a user chooses an accommodation offer. | `AccommodationOfferChoice` |
| `changePaymentType` | `src/components/BflexEditableAccommodationCard.vue` | `src/pages/ConfirmationPage.vue` | Fired when the user changes the payment type. | `number` (payment type ID) |
| `deleteAccommodation` | `src/components/BflexEditableAccommodationCard.vue` | `src/pages/ConfirmationPage.vue` | Fired when the user deletes an accommodation from the cart. | `string` (item hash) |
| `onAccommodationSummaryClick` | `src/components/BflexSummaryPanel.vue` | `src/pages/ConfirmationPage.vue` | Fired when the user clicks on the summary panel info icon. | None |
| `cancelReservation` | `src/pages/CancellationPage.vue` | `src/BookingWidget.vue` | Fired when the user cancels a reservation. | None |

### Event Payload Structures

#### ReleasedPayload

```typescript
interface ReleasedPayload {
  action: string;  // Action constant from constants.js
  result?: any;    // Optional result data (e.g., cart, reservation info)
}
```

**Example:**
```javascript
{
  action: "booking_confirmation",
  result: {
    reservations: ["RES123456"]
  }
}
```

#### RatePlanVariant

```typescript
interface RatePlanVariant {
  occupancyOptions: {
    kind: string;     // "adults" or "mixed"
    main: number;     // Number of guests on main places
    extraBed: number; // Number of guests on extra beds
  };
  price: {
    currency: string;
    sellingPrice: string;
    originalSellingPrice?: string;
    discount?: string;
    details: {
      subtotal: string;
      taxes: string;
      charges: string;
      discounts: string;
    }
  }
}
```

#### AccommodationOfferChoice

```typescript
interface AccommodationOfferChoice {
  accommodationOffer: AccommodationOffer;
  ratePlan: RatePlan;
  variant: RatePlanVariant;
}
```

---

## URL Parameters Integration

The booking widget supports reading search parameters from the browser URL for deep linking, marketing campaigns, and shareable booking links. This feature works seamlessly with the event system and provides flexible integration options.

### Enabling URL Parameters

URL parameter support is **opt-in** and controlled by two props:

```html
<!-- Web Component -->
<bflex-booking-widget
  use-url-params="true"
  sync-url="true">
</bflex-booking-widget>

<!-- Vue Component -->
<BookingWidget
  :use-url-params="true"
  :sync-url="true" />
```

**Props:**
- `use-url-params` (default: `false`) - Enable reading URL parameters on widget initialization
- `sync-url` (default: `false`) - Enable automatic URL synchronization when search parameters change

### Supported URL Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `cancel` | String | Reservation SID for cancellation (always supported, regardless of `use-url-params`) |
| `start` | String | Check-in date (YYYY-MM-DD format) |
| `end` | String | Check-out date (YYYY-MM-DD format) |
| `promoCode` | String | Promotional/discount code |
| `accommodationTypes` | String | Comma-separated accommodation type IDs |
| `ratePlans` | String | Comma-separated rate plan IDs |

### Parameter Priority System

When the widget initializes, parameters are resolved in the following priority order:

1. **Cancel parameter** (highest priority) - Always checked, shows cancellation page
2. **URL parameters** - If `use-url-params="true"`, reads from URL
3. **Component props** - Fallback values
4. **Events** (lowest priority) - Dynamic updates via `bflex:search-bar:search`

**Example Priority Resolution:**

```html
<!-- URL: ?start=2025-01-15&end=2025-01-20&promoCode=URL2025 -->
<bflex-booking-widget
  start="2025-02-01"
  end="2025-02-05"
  promo-code="PROP2025"
  use-url-params="true">
</bflex-booking-widget>

<!-- Result: Uses URL parameters (start=2025-01-15, promoCode=URL2025) -->
```

### URL Synchronization

When `sync-url="true"`, the widget automatically updates the browser URL when search parameters change via the `bflex:search-bar:search` event:

```javascript
// User dispatches search event
window.dispatchEvent(new CustomEvent('bflex:search-bar:search', {
  detail: {
    start: '2025-03-01',
    end: '2025-03-05',
    promoCode: 'SPRING2025'
  }
}));

// Widget emits changed event
// ✓ Fired: bflex:booking-widget:changed with new params

// Widget updates URL (if sync-url=true)
// URL becomes: ?start=2025-03-01&end=2025-03-05&promoCode=SPRING2025
```

The URL is updated using `history.replaceState()` to avoid creating new browser history entries.

### Cancel Parameter Special Handling

The `cancel` parameter is **always supported** regardless of the `use-url-params` flag. This ensures cancellation links from email confirmations work reliably:

```
https://hotel.com/?cancel=RES123456
```

When a `cancel` parameter is detected:
1. Widget immediately shows the cancellation page
2. All other parameters are ignored
3. No initialization or search occurs

This behavior is critical for reservation cancellation workflows and cannot be disabled.

### Events and URL Parameters

When URL parameters are present and `use-url-params="true"`:

1. **Widget initialization:**
   - URL parameters are read and applied
   - `bflex:booking-widget:ready` event is fired
   - `bflex:booking-widget:changed` event is fired with URL values

2. **Search event updates:**
   - Incoming `bflex:search-bar:search` event updates search parameters
   - `bflex:booking-widget:changed` event is fired with new values
   - URL is updated if `sync-url="true"`

3. **Navigation tracking:**
   - `bflex:booking-widget:action` event fires normally
   - URL synchronization is independent of page navigation

### Integration Examples

**Marketing Campaign Link:**

```html
<!-- URL: https://hotel.com/?start=2025-12-20&end=2025-12-27&promoCode=XMAS2025 -->
<bflex-booking-widget
  use-url-params="true">
</bflex-booking-widget>

<script>
// Track campaign parameters
window.addEventListener('bflex:booking-widget:changed', (e) => {
  const { promoCode } = e.detail;
  if (promoCode && window.gtag) {
    gtag('event', 'campaign_loaded', {
      campaign_code: promoCode
    });
  }
});
</script>
```

**Shareable Booking Link:**

```html
<!-- URL: https://hotel.com/?start=2025-06-15&end=2025-06-20&accommodationTypes=1,2 -->
<bflex-booking-widget
  use-url-params="true"
  sync-url="true">
</bflex-booking-widget>

<script>
// Copy current booking URL to share
document.getElementById('share-btn').addEventListener('click', () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url);
  alert('Booking link copied!');
});
</script>
```

**Cancellation Link (from email):**

```html
<!-- URL: https://hotel.com/?cancel=RES123456 -->
<!-- No need for use-url-params flag - cancel is always supported -->
<bflex-booking-widget></bflex-booking-widget>

<script>
// Track cancellation page views
window.addEventListener('bflex:booking-widget:action', (e) => {
  if (e.detail.action === 'cancel_reservation') {
    console.log('User viewing cancellation page');
  }
});
</script>
```

### Technical Details

- URL parameter reading is implemented via the `useUrlParams` composable (`src/composables/useUrlParams.js`)
- Cancel parameter is checked directly in `BookingWidget.vue` `onMounted` hook
- URL synchronization uses `window.history.replaceState()` (no new history entries)
- Parameter priority is resolved during component initialization
- For detailed scenarios and implementation notes, see [URL_PARAMETERS.md](URL_PARAMETERS.md)

---

## Usage Examples

### Listening to Widget Events

```javascript
// Listen for when the widget is ready
window.addEventListener('bflex:booking-widget:ready', (event) => {
  console.log('Booking widget is ready');
});

// Listen for search parameter changes
window.addEventListener('bflex:booking-widget:changed', (event) => {
  const { start, end, promoCode } = event.detail;
  console.log(`Search updated: ${start} to ${end}, promo: ${promoCode}`);
});

// Listen for page navigation
window.addEventListener('bflex:booking-widget:action', (event) => {
  const { action } = event.detail;
  console.log(`User navigated to: ${action}`);

  // Track analytics
  if (window.gtag) {
    gtag('event', 'booking_widget_navigation', {
      page: action
    });
  }
});

// Listen for widget removal
window.addEventListener('bflex:booking-widget:removed', () => {
  console.log('Booking widget was removed from the page');
});
```

### Triggering Widget Actions

```javascript
// Update search parameters from an external search form
const searchButton = document.getElementById('search-btn');
searchButton.addEventListener('click', () => {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const promo = document.getElementById('promo-code').value;

  window.dispatchEvent(new CustomEvent('bflex:search-bar:search', {
    detail: {
      start: startDate,
      end: endDate,
      promoCode: promo || null
    }
  }));
});
```

### Using the Widget as a Web Component

```html
<!-- Basic usage -->
<bflex-booking-widget
  start="2025-01-15"
  end="2025-01-20"
></bflex-booking-widget>

<!-- With promo code -->
<bflex-booking-widget
  start="2025-02-01"
  end="2025-02-05"
  promo-code="WINTER2025"
></bflex-booking-widget>
```

### Integrating with React

```jsx
import { useEffect, useRef } from 'react';

function BookingWidget({ startDate, endDate, promoCode }) {
  const widgetRef = useRef(null);

  useEffect(() => {
    const handleReady = () => {
      console.log('Widget ready');
    };

    const handleChanged = (event) => {
      console.log('Search params changed:', event.detail);
    };

    window.addEventListener('bflex:booking-widget:ready', handleReady);
    window.addEventListener('bflex:booking-widget:changed', handleChanged);

    return () => {
      window.removeEventListener('bflex:booking-widget:ready', handleReady);
      window.removeEventListener('bflex:booking-widget:changed', handleChanged);
    };
  }, []);

  return (
    <bflex-booking-widget
      ref={widgetRef}
      start={startDate}
      end={endDate}
      promo-code={promoCode}
    />
  );
}
```

---

## Action Constants

The following action constants are defined in `src/constants.js`:

| Constant | Value | Description |
| :--- | :--- | :--- |
| `CHOOSE_ACCOMMODATION` | `'choose_accommodation'` | Offers selection page |
| `BOOKING_CONFIRMATION` | `'booking_confirmation'` | Booking confirmation page with customer info form |
| `RESERVATION_DETAILS` | `'reservation_details'` | Reservation result/details page |
| `CANCEL_RESERVATION` | `'cancel_reservation'` | Reservation cancellation page |
| `EMPTY_CART` | `'empty_cart'` | Action to clear cart and return to start |