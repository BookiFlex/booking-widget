# Custom Events Documentation

This document provides an overview of the custom events used in the BookiFlex Booking Widget project.

## Emitted Events

These are events that are dispatched from the booking widget to the parent window.

| Event Name | Emitted From | Description |
| :--- | :--- | :--- |
| `bflex:booking-widget:ready` | `src/BookingWidget.vue` | Fired when the booking widget is mounted and ready to be interacted with. |
| `bflex:booking-widget:changed` | `src/BookingWidget.vue` | Fired when the search parameters (start date, end date, promo code) are changed. The event detail contains the new search parameters. |
| `bflex:booking-widget:action` | `src/BookingWidget.vue` | Fired when the user navigates between the different pages of the booking widget. The event detail contains the name of the active page. |
| `bflex:booking-widget:removed` | `src/BookingWidget.ce.vue`, `src/App.vue` | Fired when the booking widget is removed from the DOM. |

## Listened Events

These are events that the booking widget listens for from the parent window.

| Event Name | Listened In | Description |
| :--- | :--- | :--- |
| `bflex:search-bar:search` | `src/BookingWidget.vue` | When this event is received, the booking widget updates its search parameters with the data from the event detail and re-fetches the accommodation offers. The event detail should contain `start`, `end`, and `promoCode` properties. |

## Internal Component Events

These events are used for communication between the internal components of the booking widget.

| Event Name | Emitted From | Listened In | Description |
| :--- | :--- | :--- | :--- |
| `released` | `ChooseAccommodationPage.vue`, `ConfirmationPage.vue`, `ResultPage.vue` | `BookingWidget.vue` | Fired when a page-level action is completed (e.g., choosing an accommodation, confirming a booking). |
| `variant-chosen` | `BflexRatePlanItem.vue` | `BflexAccommodationOfferCard.vue` | Fired when a user selects a rate plan variant. |
| `accommodationOfferChosen` | `BflexAccommodationOfferCard.vue` | `ChooseAccommodationPage.vue` | Fired when a user chooses an accommodation offer. |
| `changePaymentType` | `BflexChosenAccommodationsCard.vue` | `ConfirmationPage.vue` | Fired when the user changes the payment type. |
| `deleteAccommodationRequest` | `BflexChosenAccommodationsCard.vue` | `ConfirmationPage.vue` | Fired when the user deletes an accommodation from the cart. |
| `onAccommodationSummaryClick` | `BflexSummaryPanel.vue` | `ConfirmationPage.vue` | Fired when the user clicks on the summary panel. |
| `cancelReservation` | `CancelReservationPage.vue` | `BookingWidget.vue` | Fired when the user cancels a reservation. |
