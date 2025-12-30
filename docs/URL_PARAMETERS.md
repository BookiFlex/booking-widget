# URL Parameters Support

This document describes how the BookiFlex Booking Widget handles URL parameters for deep linking, marketing campaigns, and shareable booking links.

## Table of Contents

- [Overview](#overview)
- [Supported URL Parameters](#supported-url-parameters)
- [Component Props](#component-props)
- [Usage Modes](#usage-modes)
- [Scenarios](#scenarios)
- [Parameter Priority](#parameter-priority)
- [URL Synchronization](#url-synchronization)
- [Cancel Parameter](#cancel-parameter)
- [Examples](#examples)
- [Implementation Notes](#implementation-notes)

---

## Overview

The booking widget supports reading search parameters from the browser URL, enabling:

- **Deep linking** - Direct links to specific search results
- **Marketing campaigns** - Pre-filled promotional links with dates and promo codes
- **Shareable links** - Users can share their search via URL
- **Cancellation links** - Direct links to reservation cancellation page

The functionality works in both **Web Component** and **Vue Component** modes, and supports both **modal (controller)** and **standalone (embedded)** integration scenarios.

---

## Supported URL Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `start` | String (YYYY-MM-DD) | Check-in date | `?start=2025-01-15` |
| `end` | String (YYYY-MM-DD) | Check-out date | `?end=2025-01-20` |
| `promoCode` | String | Promotional/discount code | `?promoCode=WINTER2025` |
| `accommodationTypes` | String (comma-separated IDs) | Filter by accommodation type IDs | `?accommodationTypes=1,2,3` |
| `ratePlans` | String (comma-separated IDs) | Filter by rate plan IDs | `?ratePlans=5,6` |
| `cancel` | String | Reservation SID for cancellation | `?cancel=RES123456` |

### Parameter Format Notes

- **Dates** must be in ISO format: `YYYY-MM-DD`
- **IDs** are comma-separated without spaces: `1,2,3`
- **Strings** are used as-is (URL encoding handled automatically by browser)
- All parameters are **case-sensitive**

---

## Component Props

New props control URL parameter behavior:

### useUrlParams

- **Type:** `Boolean`
- **Default:** `false`
- **Description:** Enable reading URL parameters on widget initialization

```html
<!-- Web Component -->
<bflex-booking-widget use-url-params="true"></bflex-booking-widget>

<!-- Vue Component -->
<BookingWidget :use-url-params="true" />
```

### syncUrl

- **Type:** `Boolean`
- **Default:** `false`
- **Description:** Enable automatic URL synchronization when search parameters change

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

### Existing Props

All existing props continue to work:
- `start` - Check-in date (fallback if URL param not present)
- `end` - Check-out date (fallback if URL param not present)
- `promo-code` - Promotional code (fallback if URL param not present)
- `accommodation-types` - Accommodation type filter
- `rate-plans` - Rate plan filter

---

## Usage Modes

The widget can be used in two ways:

### Web Component Mode

```html
<bflex-booking-widget
  start="2025-01-15"
  end="2025-01-20"
  promo-code="WINTER"
  use-url-params="true"
  sync-url="true">
</bflex-booking-widget>
```

- All attributes are strings
- `accommodation-types` and `rate-plans` are comma-separated strings
- Web Component wrapper passes attributes to the core Vue component
- URL logic handled entirely by the core component

### Vue Component Mode

```vue
<script setup>
import { BookingWidget } from 'bookiflex-booking-widget';

const searchParams = {
  start: '2025-01-15',
  end: '2025-01-20',
  promoCode: 'WINTER'
};
</script>

<template>
  <BookingWidget
    :start="searchParams.start"
    :end="searchParams.end"
    :promo-code="searchParams.promoCode"
    :use-url-params="true"
    :sync-url="true"
  />
</template>
```

- Props are properly typed
- `accommodationTypes` and `ratePlans` can be arrays or strings
- Direct integration with Vue app

---

## Scenarios

### Scenario 1: Controller Mode (Modal Window)

**Setup:**
```javascript
import { SearchWidgetController } from 'bookiflex-widget-controller';

new SearchWidgetController({
  scripts: ['...'],
  css: ['...'],
  autoOpenFromUrl: true  // default
});
```

**Behavior:**

1. **On page load**, controller checks URL for parameters
2. **If parameters found** (`start` and `end` present):
   - Automatically opens modal window
   - Passes parameters to booking widget via `bflex:search-bar:search` event
   - Widget displays search results immediately
3. **If no parameters**, behaves normally (waits for user to click trigger)

**Example:**

```
User visits: https://hotel.com/?start=2025-01-15&end=2025-01-20&promoCode=WINTER

Flow:
1. Controller detects URL parameters
2. Controller auto-opens modal
3. Widget receives parameters: { start: "2025-01-15", end: "2025-01-20", promoCode: "WINTER" }
4. Widget fetches and displays offers
5. User changes dates → URL updates (if sync-url enabled)
```

**Disable auto-open:**

```javascript
new SearchWidgetController({
  scripts: ['...'],
  autoOpenFromUrl: false  // disable auto-open
});
```

### Scenario 2: Standalone Mode (Embedded Widget)

**Setup:**
```html
<bflex-booking-widget
  use-url-params="true"
  sync-url="true">
</bflex-booking-widget>
```

**Behavior:**

1. **On widget mount**, reads URL parameters
2. **Merges** with component props (URL has priority)
3. **Initializes** search with merged parameters
4. **If `sync-url` enabled**, updates URL when user changes search parameters

**Example:**

```
User visits: https://hotel.com/booking/?start=2025-01-15&end=2025-01-20

Flow:
1. Widget reads URL: { start: "2025-01-15", end: "2025-01-20" }
2. Widget props: { start: "", end: "", promoCode: "" }
3. Merged params: { start: "2025-01-15", end: "2025-01-20", promoCode: "" }
4. Widget fetches and displays offers
5. User changes end date to 2025-01-22 → URL updates to ?start=2025-01-15&end=2025-01-22
6. User copies URL and shares → recipient sees same search
```

### Scenario 3: Marketing Campaign Links

**Use case:** Hotel sends email campaign with special offers

**Link format:**
```
https://hotel.com/?start=2025-12-20&end=2025-12-27&promoCode=XMAS2025
```

**In controller mode:**
- Modal opens automatically with dates and promo code pre-filled
- User sees offers with discount applied
- Smooth user experience (no manual input needed)

**In standalone mode:**
- Widget shows search results immediately
- Promo code already applied to pricing
- User can modify dates/promo and URL updates

### Scenario 4: Deep Linking to Search Results

**Use case:** User finds accommodation, wants to share

**How it works:**

1. User searches: `start=2025-02-01`, `end=2025-02-05`, finds accommodation
2. User copies URL from browser: `https://hotel.com/booking/?start=2025-02-01&end=2025-02-05`
3. Shares link via email/messenger
4. Recipient clicks link → sees same search results
5. Recipient can proceed with booking

### Scenario 5: Cancellation Link

**Use case:** Customer receives email with cancellation link

**Link format:**
```
https://hotel.com/?cancel=RES123456
```

**Behavior:**

1. Controller/Widget detects `cancel` parameter
2. **Ignores ALL other parameters** (start, end, promoCode, etc.)
3. Opens cancellation page for reservation `RES123456`
4. User enters cancellation code from email
5. Confirms cancellation

**Priority:** The `cancel` parameter has **highest priority** and overrides everything else.

---

## Parameter Priority

Parameters can come from multiple sources. The priority order (highest to lowest):

### 1. Cancel Parameter (Highest Priority)

```
URL: ?cancel=RES123456&start=2025-01-15&end=2025-01-20
Result: Opens cancellation page, ignores start/end
```

### 2. URL Parameters

```
URL: ?start=2025-01-15&end=2025-01-20
Props: start="2025-02-01", end="2025-02-05"
Result: Uses URL values (2025-01-15, 2025-01-20)
```

**Note:** Only when `useUrlParams=true`

### 3. Component Props

```
URL: (no parameters)
Props: start="2025-02-01", end="2025-02-05"
Result: Uses prop values (2025-02-01, 2025-02-05)
```

### 4. Search Bar Events

```
Widget initialized with props
User changes search bar → emits 'bflex:search-bar:search' event
Widget updates with event data
```

### Summary Table

| Source | Priority | Condition |
|--------|----------|-----------|
| `cancel` URL parameter | 1 (highest) | Always |
| URL parameters | 2 | `useUrlParams=true` |
| Component props | 3 | Always |
| Search bar events | 4 (lowest) | Always |

---

## URL Synchronization

When `syncUrl=true`, the widget updates the browser URL when search parameters change.

### Synchronization Behavior

**Method:** `history.replaceState()` - Updates URL without creating new history entry

**When URL updates:**
- User changes check-in date
- User changes check-out date
- User enters/removes promo code
- Widget receives new parameters via `bflex:search-bar:search` event

**When URL does NOT update:**
- `syncUrl=false` (disabled)
- `useUrlParams=false` (URL reading disabled)
- User navigates between booking flow pages (offers → confirmation → result)

### Example Flow

```
Initial URL: https://hotel.com/booking/

1. Widget loads → URL unchanged (no parameters)

2. User enters dates (2025-01-15 to 2025-01-20)
   → URL updates: ?start=2025-01-15&end=2025-01-20

3. User enters promo code "WINTER"
   → URL updates: ?start=2025-01-15&end=2025-01-20&promoCode=WINTER

4. User removes promo code
   → URL updates: ?start=2025-01-15&end=2025-01-20

5. User selects accommodation → navigates to confirmation page
   → URL unchanged (maintains search parameters)

6. User completes booking
   → URL unchanged
```

### Benefits

- **Shareable links** - Copy URL from address bar works
- **Browser back button** - Navigation works correctly
- **Page refresh** - Returns to same search
- **Bookmarking** - Save search for later

---

## Cancel Parameter

The `cancel` parameter enables direct links to reservation cancellation.

### Behavior

**When `cancel` parameter is present:**

1. **All other parameters ignored** (start, end, promoCode, etc.)
2. Widget navigates directly to cancellation page
3. Displays reservation details for the given SID
4. User enters cancellation code
5. Confirms or cancels action

### Example

**Email sent to customer:**
```
Your reservation: RES123456

To cancel your booking, click here:
https://hotel.com/?cancel=RES123456

Cancellation code: XYZ789
```

**User clicks link:**
```
URL: https://hotel.com/?cancel=RES123456

Flow:
1. Controller/Widget detects 'cancel' parameter
2. Ignores any other URL parameters
3. Opens modal/loads widget
4. Navigates directly to cancellation page
5. Loads reservation RES123456
6. Shows cancellation form
7. User enters code XYZ789
8. Confirms cancellation
```

### Implementation Detail

The `cancel` parameter is checked in `BookingWidget.vue` initialization:

```javascript
onMounted(async () => {
  const params = new URLSearchParams(window.location.search);

  if (params.has('cancel')) {
    const sid = params.get('cancel');
    startCancellation(sid);  // Navigate to cancellation page
    return;  // Skip all other logic
  }

  // Continue with normal initialization...
});
```

---

## Examples

### Example 1: Basic Web Component with URL Support

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="bookiflex-booking-widget.css">
</head>
<body>
  <!-- Widget reads URL and syncs changes back -->
  <bflex-booking-widget
    use-url-params="true"
    sync-url="true">
  </bflex-booking-widget>

  <script src="bookiflex-booking-widget.umd.js"></script>
</body>
</html>
```

**URL:** `https://hotel.com/booking/?start=2025-01-15&end=2025-01-20`
**Result:** Widget shows offers for Jan 15-20, URL updates when user changes dates

### Example 2: Vue Component with Fallback Props

```vue
<script setup>
import { BookingWidget } from 'bookiflex-booking-widget';

// Fallback dates if URL is empty
const defaultStart = '2025-03-01';
const defaultEnd = '2025-03-05';
</script>

<template>
  <!-- URL params override these defaults -->
  <BookingWidget
    :start="defaultStart"
    :end="defaultEnd"
    :use-url-params="true"
    :sync-url="true"
  />
</template>
```

**URL:** `https://hotel.com/booking/` (empty)
**Result:** Widget uses fallback dates (Mar 1-5)

**URL:** `https://hotel.com/booking/?start=2025-04-10&end=2025-04-15`
**Result:** Widget uses URL dates (Apr 10-15), ignores props

### Example 3: Controller with Auto-Open

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Trigger button (optional) -->
  <button data-open-bflex-widget>Book Now</button>

  <script src="bookiflex-widget-controller.umd.js"></script>
  <script>
    new SearchWidgetController({
      scripts: [
        'bookiflex-search-bar-widget.umd.js',
        'bookiflex-booking-widget.umd.js'
      ],
      css: ['glightbox.min.css'],
      autoOpenFromUrl: true  // Enable auto-open from URL
    });
  </script>
</body>
</html>
```

**URL:** `https://hotel.com/` (empty)
**Result:** Modal closed, waiting for user to click button

**URL:** `https://hotel.com/?start=2025-05-01&end=2025-05-05&promoCode=MAY`
**Result:** Modal auto-opens with search results for May 1-5 with promo code

### Example 4: Marketing Campaign

**Campaign setup:**
```javascript
const campaignUrl = new URL('https://hotel.com/');
campaignUrl.searchParams.set('start', '2025-12-20');
campaignUrl.searchParams.set('end', '2025-12-27');
campaignUrl.searchParams.set('promoCode', 'XMAS2025');

console.log(campaignUrl.href);
// https://hotel.com/?start=2025-12-20&end=2025-12-27&promoCode=XMAS2025
```

**Email template:**
```html
<a href="https://hotel.com/?start=2025-12-20&end=2025-12-27&promoCode=XMAS2025">
  Book Your Christmas Stay - Special 20% OFF!
</a>
```

**User experience:**
1. Clicks link in email
2. Modal auto-opens (controller mode) or widget loads (standalone mode)
3. Sees offers for Dec 20-27 with XMAS2025 discount applied
4. Completes booking

### Example 5: Future - Filtered Search

**URL with filters (future implementation):**
```
https://hotel.com/?start=2025-06-01&end=2025-06-05&accommodationTypes=1,2&ratePlans=3
```

**Current behavior:**
- Widget reads all parameters
- `start`, `end` used for search
- `accommodationTypes` and `ratePlans` stored but not used in API request

**Future behavior:**
- API will accept filter parameters
- Widget will pass them to `/offers` endpoint
- Results filtered by accommodation types [1, 2] and rate plan [3]

---

## Implementation Notes

### Architecture

**Component Hierarchy:**
```
BookingWidget.ce.vue (Web Component wrapper)
  ↓ (passes props as-is)
BookingWidget.vue (Core component)
  ↓ (uses)
useUrlParams() composable
```

**Data Flow:**
```
URL → useUrlParams() → BookingWidget.vue → searchParams ref → API requests
                                    ↓
                            (if syncUrl=true)
                                    ↓
                            history.replaceState()
```

### Composable: useUrlParams

**Location:** `src/composables/useUrlParams.js`

**Purpose:**
- Read URL parameters on initialization
- Update URL when parameters change
- Return raw string values (matches URL format)

**Returns:**
```javascript
{
  urlParams: Ref<Object|null>,     // Current URL params
  updateUrl: Function,              // Update URL with new params
  clearUrlParams: Function          // Remove params from URL
}
```

### BookingWidget.vue Changes

**New Props:**
```javascript
useUrlParams: {
  type: Boolean,
  default: false
},
syncUrl: {
  type: Boolean,
  default: false
}
```

**Initialization Logic:**
```javascript
const { urlParams, updateUrl } = useUrlParams({
  enabled: props.useUrlParams
});

// Priority: URL > Props
const searchParams = ref({
  start: urlParams.value?.start || props.start,
  end: urlParams.value?.end || props.end,
  promoCode: urlParams.value?.promoCode || props.promoCode,
  accommodationTypes: urlParams.value?.accommodationTypes || props.accommodationTypes,
  ratePlans: urlParams.value?.ratePlans || props.ratePlans
});

// Watch and sync URL
watch(searchParams, (value) => {
  if (props.syncUrl) {
    updateUrl(value);
  }
  // ... emit events
}, { deep: true });
```

### SearchWidgetController Changes

**New Constructor Option:**
```javascript
constructor({ scripts, css, autoOpenFromUrl = true }) {
  // ...
  this.autoOpenFromUrl = autoOpenFromUrl;
  this.checkUrlAndAutoOpen();
}
```

**Auto-open Logic:**
```javascript
checkUrlAndAutoOpen() {
  if (!this.autoOpenFromUrl) return;

  const params = new URLSearchParams(window.location.search);
  const start = params.get('start');
  const end = params.get('end');
  const cancel = params.get('cancel');

  // Cancel has priority
  if (cancel) {
    this.openModalWithParams({ cancel });
    return;
  }

  // Regular search
  if (start && end) {
    const promoCode = params.get('promoCode');
    this.openModalWithParams({ start, end, promoCode });
  }
}
```

### Backward Compatibility

**Guaranteed:**
- ✅ Existing integrations work without changes
- ✅ All new features opt-in (require explicit props)
- ✅ Default behavior unchanged (`useUrlParams=false`, `syncUrl=false`)
- ✅ Existing `cancel` parameter continues to work
- ✅ Props-only mode still works

**Migration:**
- No breaking changes
- To enable URL support, add `use-url-params="true"` attribute
- To enable URL sync, add `sync-url="true"` attribute
- Controller auto-open can be disabled via `autoOpenFromUrl: false`

### Bug Fix

**Web Component wrapper** (`BookingWidget.ce.vue:40`):
```javascript
// Current (bug):
preparedParams.value = {
  accommodationTypes: value.accommodationTypes.split(','),
  ratePlans: value.accommodationTypes.split(','),  // ❌ Wrong!
}

// Fixed:
preparedParams.value = {
  accommodationTypes: value.accommodationTypes.split(','),
  ratePlans: value.ratePlans.split(','),  // ✅ Correct
}
```

---

## Related Documentation

- [Custom Events](./CUSTOM_EVENTS.md) - Widget event system
- [README](../README.md) - General widget documentation
- [BookiFlex Core](../../../docs/) - Backend API documentation

---

## Future Enhancements

### Planned Features

1. **API Filter Support**
   - Pass `accommodationTypes` and `ratePlans` to `/offers` endpoint
   - Backend filters results before returning
   - Reduces client-side filtering

2. **Additional URL Parameters**
   - `guests` - Number of guests (adults + children)
   - `rooms` - Number of rooms
   - `view` - Initial view mode (grid/list)

3. **URL State Preservation**
   - Remember selected filters across page navigation
   - Restore scroll position
   - Maintain expanded/collapsed state

4. **Analytics Integration**
   - Track URL parameter usage
   - Campaign effectiveness (which promo codes used)
   - Source tracking (where traffic comes from)

### Not Planned

- ❌ Custom parameter name mapping (keeps API simple)
- ❌ Multiple date range support (single booking only)
- ❌ Query string encryption (URLs should be human-readable)
