# URL Parameters Testing Guide

This document provides a comprehensive testing checklist for the URL parameters functionality in the BookiFlex Booking Widget.

## Table of Contents

- [Overview](#overview)
- [Test Environment Setup](#test-environment-setup)
- [Standalone Mode Testing](#standalone-mode-testing)
- [Controller Mode Testing](#controller-mode-testing)
- [Priority System Testing](#priority-system-testing)
- [Integration & Events Testing](#integration--events-testing)
- [Edge Cases & Validation](#edge-cases--validation)
- [Browser Compatibility Checklist](#browser-compatibility-checklist)

---

## Overview

**Feature**: URL parameter support for deep linking, marketing campaigns, and cancellation workflows.

**Supported Parameters**:
- `cancel` - Reservation SID (always active)
- `start` - Check-in date (YYYY-MM-DD)
- `end` - Check-out date (YYYY-MM-DD)
- `promoCode` - Promotional code
- `accommodationTypes` - Comma-separated IDs
- `ratePlans` - Comma-separated IDs

**Widget Props**:
- `use-url-params` (default: false) - Enable URL reading
- `sync-url` (default: false) - Enable URL synchronization

**Controller Options**:
- `autoOpenFromUrl` (default: true) - Auto-open modal from URL

---

## Test Environment Setup

### Standalone Mode Setup

```html
<!-- Test page: test-standalone.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dist/style.css">
</head>
<body>
  <bflex-booking-widget
    start="2025-01-15"
    end="2025-01-20"
    use-url-params="true"
    sync-url="true">
  </bflex-booking-widget>

  <script src="dist/bookiflex-booking-widget.umd.js"></script>
</body>
</html>
```

### Controller Mode Setup

```html
<!-- Test page: test-controller.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="controller/style.css">
  <link rel="stylesheet" href="widget/style.css">
</head>
<body>
  <button id="open-booking">Open Booking</button>

  <script src="widget/bookiflex-booking-widget.umd.js"></script>
  <script src="controller/bookiflex-controller.umd.js"></script>
  <script>
    new SearchWidgetController({
      scripts: ['widget/bookiflex-booking-widget.umd.js'],
      css: ['widget/style.css'],
      autoOpenFromUrl: true
    });

    document.getElementById('open-booking').addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('bflex:search-bar:search', {
        detail: { start: '2025-02-01', end: '2025-02-05' }
      }));
    });
  </script>
</body>
</html>
```

### Event Listener Setup (for debugging)

```javascript
// Add to test pages for event monitoring
window.addEventListener('bflex:booking-widget:ready', () => {
  console.log('[Event] Widget ready');
});

window.addEventListener('bflex:booking-widget:changed', (e) => {
  console.log('[Event] Search changed:', e.detail);
});

window.addEventListener('bflex:booking-widget:action', (e) => {
  console.log('[Event] Action:', e.detail.action);
});
```

---

## Standalone Mode Testing

### Group 1: Default Behavior (no URL flags)

- [ ] **TC-S01: Default initialization without URL parameters**
  - URL: `/test-standalone.html`
  - Props: `start="2025-01-15" end="2025-01-20" use-url-params="false"`
  - Expected: Widget uses prop values, ignores URL

- [ ] **TC-S02: URL parameters ignored when useUrlParams=false**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05`
  - Props: `start="2025-01-15" end="2025-01-20" use-url-params="false"`
  - Expected: Widget uses props (2025-01-15 to 2025-01-20), not URL

- [ ] **TC-S03: Cancel parameter works without useUrlParams flag**
  - URL: `/test-standalone.html?cancel=RES123456`
  - Props: `use-url-params="false"`
  - Expected: Shows cancellation page for RES123456

### Group 2: URL Reading (useUrlParams=true)

- [ ] **TC-S04: Basic URL parameters reading**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05`
  - Props: `use-url-params="true"`
  - Expected: Widget uses URL dates (2025-03-01 to 2025-03-05)

- [ ] **TC-S05: Promo code from URL**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05&promoCode=SUMMER2025`
  - Props: `use-url-params="true"`
  - Expected: Dates and promo code applied, visible in search

- [ ] **TC-S06: Accommodation types filter from URL**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05&accommodationTypes=1,2,3`
  - Props: `use-url-params="true"`
  - Expected: Only accommodation types 1, 2, 3 shown in results

- [ ] **TC-S07: Rate plans filter from URL**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05&ratePlans=5,6`
  - Props: `use-url-params="true"`
  - Expected: Only rate plans 5, 6 shown in results

- [ ] **TC-S08: All parameters combined**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05&promoCode=TEST&accommodationTypes=1&ratePlans=5`
  - Props: `use-url-params="true"`
  - Expected: All filters applied correctly

- [ ] **TC-S09: Partial URL parameters (only start/end)**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05`
  - Props: `use-url-params="true" promo-code="PROP2025"`
  - Expected: Uses URL dates, prop promo code

- [ ] **TC-S10: Empty URL parameters ignored**
  - URL: `/test-standalone.html?start=&end=&promoCode=`
  - Props: `start="2025-01-15" end="2025-01-20" use-url-params="true"`
  - Expected: Uses prop values (empty URL params ignored)

### Group 3: URL Synchronization (syncUrl=true)

- [ ] **TC-S11: Initial URL sync on load**
  - URL: `/test-standalone.html`
  - Props: `start="2025-01-15" end="2025-01-20" use-url-params="true" sync-url="true"`
  - Expected: URL updated to `?start=2025-01-15&end=2025-01-20`

- [ ] **TC-S12: URL sync after search event**
  - URL: `/test-standalone.html`
  - Props: `use-url-params="true" sync-url="true"`
  - Action: Dispatch `bflex:search-bar:search` with new dates
  - Expected: URL updated with new dates, no page reload

- [ ] **TC-S13: URL sync preserves non-widget parameters**
  - URL: `/test-standalone.html?utm_source=google&utm_campaign=test`
  - Props: `start="2025-01-15" end="2025-01-20" sync-url="true"`
  - Expected: URL becomes `?utm_source=google&utm_campaign=test&start=2025-01-15&end=2025-01-20`

- [ ] **TC-S14: No URL sync when syncUrl=false**
  - URL: `/test-standalone.html`
  - Props: `start="2025-01-15" end="2025-01-20" use-url-params="true" sync-url="false"`
  - Expected: URL remains `/test-standalone.html` (no parameters added)

### Group 4: Cancel Parameter (always active)

- [ ] **TC-S15: Cancel with search parameters (cancel has priority)**
  - URL: `/test-standalone.html?cancel=RES123&start=2025-03-01&end=2025-03-05`
  - Props: `use-url-params="true"`
  - Expected: Shows cancellation page, search params ignored

- [ ] **TC-S16: Cancel initializes settings before showing page**
  - URL: `/test-standalone.html?cancel=RES123456`
  - Expected: CancellationPage shows hotel info and correct locale (settings loaded)

---

## Controller Mode Testing

### Group 5: Auto-Open from URL

- [ ] **TC-C01: Auto-open modal with search parameters**
  - URL: `/test-controller.html?start=2025-03-01&end=2025-03-05`
  - Controller: `autoOpenFromUrl: true`
  - Expected: Modal opens automatically with dates from URL

- [ ] **TC-C02: Auto-open with promo code**
  - URL: `/test-controller.html?start=2025-03-01&end=2025-03-05&promoCode=WINTER2025`
  - Controller: `autoOpenFromUrl: true`
  - Expected: Modal opens, promo code applied, offers loaded

- [ ] **TC-C03: Auto-open with filters**
  - URL: `/test-controller.html?start=2025-03-01&end=2025-03-05&accommodationTypes=1,2&ratePlans=5`
  - Controller: `autoOpenFromUrl: true`
  - Expected: Modal opens with filtered results

- [ ] **TC-C04: Auto-open for cancellation**
  - URL: `/test-controller.html?cancel=RES123456`
  - Controller: `autoOpenFromUrl: true`
  - Expected: Modal opens showing cancellation page

- [ ] **TC-C05: No auto-open when autoOpenFromUrl=false**
  - URL: `/test-controller.html?start=2025-03-01&end=2025-03-05`
  - Controller: `autoOpenFromUrl: false`
  - Expected: Modal does NOT open automatically

- [ ] **TC-C06: Manual open button works alongside URL**
  - URL: `/test-controller.html?start=2025-03-01&end=2025-03-05`
  - Controller: `autoOpenFromUrl: false`
  - Action: Click "Open Booking" button
  - Expected: Modal opens with button's parameters (not URL)

### Group 6: Controller + Widget Interaction

- [ ] **TC-C07: Controller passes URL params to widget**
  - URL: `/test-controller.html?start=2025-03-01&end=2025-03-05&promoCode=TEST`
  - Controller: `autoOpenFromUrl: true`
  - Expected: Widget inside modal shows correct dates and promo code

- [ ] **TC-C08: Widget events fire when opened from URL**
  - URL: `/test-controller.html?start=2025-03-01&end=2025-03-05`
  - Controller: `autoOpenFromUrl: true`
  - Expected: `bflex:booking-widget:ready` and `bflex:booking-widget:changed` events fire

- [ ] **TC-C09: Cancel priority in controller mode**
  - URL: `/test-controller.html?cancel=RES123&start=2025-03-01`
  - Controller: `autoOpenFromUrl: true`
  - Expected: Modal opens to cancellation page (search params ignored)

- [ ] **TC-C10: Web component registration wait**
  - URL: `/test-controller.html?start=2025-03-01&end=2025-03-05`
  - Controller: `autoOpenFromUrl: true`
  - Expected: Controller waits for web component, then opens modal (no errors)

---

## Priority System Testing

### Group 7: URL vs Props Priority

- [ ] **TC-P01: URL overrides props when useUrlParams=true**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05`
  - Props: `start="2025-01-15" end="2025-01-20" use-url-params="true"`
  - Expected: Widget uses URL dates (2025-03-01 to 2025-03-05)

- [ ] **TC-P02: Props used as fallback for missing URL params**
  - URL: `/test-standalone.html?promoCode=URLCODE`
  - Props: `start="2025-01-15" end="2025-01-20" use-url-params="true"`
  - Expected: Dates from props, promo code from URL

- [ ] **TC-P03: URL partial override**
  - URL: `/test-standalone.html?start=2025-03-01`
  - Props: `start="2025-01-15" end="2025-01-20" use-url-params="true"`
  - Expected: start from URL (2025-03-01), end from props (2025-01-20)

### Group 8: URL vs Events Priority

- [ ] **TC-P04: Event updates override URL initial values**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05`
  - Props: `use-url-params="true" sync-url="true"`
  - Action: Dispatch `bflex:search-bar:search` with new dates
  - Expected: Widget updates to event dates, URL synced

- [ ] **TC-P05: Multiple event updates**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05`
  - Props: `use-url-params="true" sync-url="true"`
  - Action: Dispatch search event twice with different dates
  - Expected: Widget and URL update both times

### Group 9: Cancel Priority

- [ ] **TC-P06: Cancel overrides all search parameters**
  - URL: `/test-standalone.html?cancel=RES123&start=2025-03-01&end=2025-03-05&promoCode=TEST`
  - Props: `start="2025-01-15" use-url-params="true"`
  - Expected: Cancellation page shown, all search params ignored

- [ ] **TC-P07: Cancel in controller mode has priority**
  - URL: `/test-controller.html?cancel=RES123&start=2025-03-01`
  - Controller: `autoOpenFromUrl: true`
  - Expected: Modal opens to cancellation page

- [ ] **TC-P08: Cancel works even without autoOpenFromUrl**
  - URL: `/test-controller.html?cancel=RES123456`
  - Controller: `autoOpenFromUrl: false`
  - Expected: Modal still opens for cancellation (cancel bypasses flag)

---

## Integration & Events Testing

### Group 10: Event Emission

- [ ] **TC-E01: bflex:booking-widget:ready fires on mount**
  - URL: `/test-standalone.html`
  - Expected: `bflex:booking-widget:ready` event fires once

- [ ] **TC-E02: bflex:booking-widget:changed fires on URL init**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05`
  - Props: `use-url-params="true"`
  - Expected: `bflex:booking-widget:changed` event fires with URL values

- [ ] **TC-E03: bflex:booking-widget:changed fires on event update**
  - URL: `/test-standalone.html`
  - Action: Dispatch `bflex:search-bar:search`
  - Expected: `bflex:booking-widget:changed` event fires with new values

- [ ] **TC-E04: bflex:booking-widget:action fires on navigation**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05`
  - Action: Navigate through booking flow
  - Expected: `bflex:booking-widget:action` events fire for each page

### Group 11: URL Synchronization Edge Cases

- [ ] **TC-E05: URL sync doesn't create history entries**
  - URL: `/test-standalone.html`
  - Props: `start="2025-01-15" end="2025-01-20" sync-url="true"`
  - Expected: URL updates, but browser back button goes to previous site (not previous URL state)

- [ ] **TC-E06: URL sync updates on every search change**
  - URL: `/test-standalone.html`
  - Props: `use-url-params="true" sync-url="true"`
  - Action: Dispatch search event 3 times
  - Expected: URL updates 3 times with latest values

---

## Edge Cases & Validation

### Group 12: Invalid/Missing Parameters

- [ ] **TC-V01: Invalid date format in URL**
  - URL: `/test-standalone.html?start=01-15-2025&end=2025-01-20`
  - Props: `use-url-params="true"`
  - Expected: Widget shows error or uses prop defaults (graceful handling)

- [ ] **TC-V02: Missing end date in URL**
  - URL: `/test-standalone.html?start=2025-03-01`
  - Props: `use-url-params="true" end="2025-03-05"`
  - Expected: Uses start from URL, end from props

- [ ] **TC-V03: End date before start date**
  - URL: `/test-standalone.html?start=2025-03-05&end=2025-03-01`
  - Props: `use-url-params="true"`
  - Expected: Widget shows validation error

- [ ] **TC-V04: Past dates in URL**
  - URL: `/test-standalone.html?start=2020-01-01&end=2020-01-05`
  - Props: `use-url-params="true"`
  - Expected: Widget shows error or no results (past dates)

### Group 13: Special Characters & Encoding

- [ ] **TC-V05: Promo code with special characters**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05&promoCode=SAVE-20%`
  - Props: `use-url-params="true"`
  - Expected: Promo code correctly decoded and applied

- [ ] **TC-V06: URL encoded parameters**
  - URL: `/test-standalone.html?promoCode=SAVE%2020%25`
  - Props: `use-url-params="true"`
  - Expected: Promo code decoded as "SAVE 20%"

- [ ] **TC-V07: Multiple values in accommodationTypes**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05&accommodationTypes=1,2,3,4,5`
  - Props: `use-url-params="true"`
  - Expected: All 5 accommodation types filtered correctly

- [ ] **TC-V08: Empty promoCode parameter**
  - URL: `/test-standalone.html?start=2025-03-01&end=2025-03-05&promoCode=`
  - Props: `use-url-params="true"`
  - Expected: No promo code applied (empty value ignored)

---

## Browser Compatibility Checklist

Test the following scenarios across all browsers:

### Desktop Browsers

- [ ] **Chrome** (latest)
  - TC-S04, TC-S11, TC-C01, TC-P01
- [ ] **Firefox** (latest)
  - TC-S04, TC-S11, TC-C01, TC-P01
- [ ] **Safari** (latest)
  - TC-S04, TC-S11, TC-C01, TC-P01
- [ ] **Edge** (latest)
  - TC-S04, TC-S11, TC-C01, TC-P01

### Mobile Browsers

- [ ] **Safari iOS** (latest)
  - TC-S04, TC-C01, TC-P01
- [ ] **Chrome Android** (latest)
  - TC-S04, TC-C01, TC-P01
- [ ] **Samsung Internet**
  - TC-S04, TC-C01

### Specific Browser Features to Verify

- [ ] URLSearchParams API support
- [ ] History API (pushState/replaceState) support
- [ ] CustomEvent support
- [ ] Web Components (customElements) support

---

## Test Execution Notes

### Critical Path (Must Pass)

Priority 1 - Core Functionality:
- TC-S04 (URL reading)
- TC-S11 (URL sync)
- TC-S03 (Cancel without flag)
- TC-S15 (Cancel priority)
- TC-C01 (Controller auto-open)
- TC-C04 (Controller cancel)
- TC-P01 (URL > Props)
- TC-P06 (Cancel > All)

Priority 2 - Integration:
- TC-E02 (Changed event)
- TC-E05 (No history pollution)
- TC-V03 (Date validation)

### Known Limitations

1. **URL parameter validation**: Widget relies on backend API for date validation
2. **Promo code validation**: Applied but validation happens server-side
3. **accommodationTypes/ratePlans**: Must match existing IDs in system

### Testing Tools

**Recommended**:
- Browser DevTools (Network, Console)
- Vue DevTools (for event inspection)
- URLSearchParams debugger: `new URLSearchParams(window.location.search).toString()`

**Event Monitoring Script**:
```javascript
// Add to browser console for debugging
['ready', 'changed', 'action', 'removed'].forEach(event => {
  window.addEventListener(`bflex:booking-widget:${event}`, (e) => {
    console.log(`[${event}]`, e.detail || 'no detail');
  });
});
```

---

## Test Results Template

```markdown
## Test Run: YYYY-MM-DD

**Tester**: [Name]
**Environment**: [Dev/Staging/Prod]
**Widget Version**: [v1.x.x]
**Browser**: [Chrome 120 / Safari 17 / etc.]

### Results Summary
- Total: 55 tests
- Passed: __
- Failed: __
- Blocked: __
- Skipped: __

### Failed Tests
- TC-XXX: [Description] - [Reason/Bug Link]

### Notes
[Any observations or issues]
```
