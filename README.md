# BookiFlex Booking Widget

A modern, standalone Vue 3 booking widget for the BookiFlex hotel booking system. This widget provides a complete booking flow from accommodation selection to reservation confirmation, and can be easily integrated into any website as a Web Component or Vue component.

## Features

- **Multi-step Booking Flow**: Seamless flow from accommodation selection to booking confirmation
- **Web Component**: Can be integrated into any website, regardless of the frontend framework
- **Vue 3 Component**: Native Vue 3 support for Vue-based applications
- **Responsive Design**: Mobile-first design with adaptive layouts
- **i18n Support**: Built-in internationalization using WordPress i18n
- **Real-time Availability**: Checks accommodation availability and pricing in real-time
- **Cart Management**: Add, remove, and modify bookings before confirmation
- **Payment Gateway Integration**: Support for multiple payment methods
- **Cancellation Flow**: Built-in reservation cancellation functionality
- **Event-based Communication**: Rich event system for parent-child communication

## Technology Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)
- **Styling**: SCSS with reset
- **UI Components**: Custom components with floating-ui for tooltips/popovers
- **HTTP Client**: Native Fetch API
- **State Management**: Vue Composables (no Vuex/Pinia)
- **Image Gallery**: GLightbox
- **Icons**: SVG icons with vite-svg-loader
- **i18n**: @wordpress/i18n

## Project Structure

```
plugin-widget-booking/
├── src/
│   ├── api/                    # API communication layer
│   │   └── api.js              # Main API methods
│   ├── assets/                 # Static assets
│   │   ├── css/                # SCSS stylesheets
│   │   └── icons/              # SVG icons
│   ├── components/             # Vue components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── InformationBlock/   # Information block components
│   │   ├── Bflex*.vue          # Domain-specific components
│   │   └── ...
│   ├── composables/            # Vue composables (hooks)
│   │   ├── useBookingFlow.js   # Booking flow management
│   │   ├── useCart.js          # Cart state and operations
│   │   ├── useOffers.js        # Offers fetching and management
│   │   ├── useReservation.js   # Reservation operations
│   │   └── useLoading.js       # Loading state management
│   ├── pages/                  # Page-level components
│   │   ├── OffersPage.vue      # Accommodation selection page
│   │   ├── ConfirmationPage.vue # Booking confirmation page
│   │   ├── ResultPage.vue      # Reservation details page
│   │   └── CancellationPage.vue # Cancellation page
│   ├── services/               # Business logic services
│   │   ├── cart.service.js     # Cart operations
│   │   ├── offers.service.js   # Offers fetching
│   │   └── reservation.service.js # Reservation operations
│   ├── util/                   # Utility functions
│   │   ├── date.js             # Date formatting and calculations
│   │   ├── money.js            # Money formatting
│   │   └── text.js             # Text utilities
│   ├── App.vue                 # Root app component
│   ├── BookingWidget.vue       # Main widget component
│   ├── BookingWidget.ce.vue    # Web Component wrapper
│   ├── constants.js            # Application constants
│   ├── index.js                # Library entry point
│   └── main.js                 # Development entry point
├── docs/                       # Documentation
│   └── CUSTOM_EVENTS.md        # Event system documentation
├── dist/                       # Built files (generated)
├── public/                     # Public static assets
├── index.html                  # Development HTML
├── vite.config.js              # Vite config for development
├── vite.config-lib.js          # Vite config for library build
├── eslint.config.js            # ESLint configuration
├── package.json                # NPM dependencies and scripts
└── README.md                   # This file
```

## Installation

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Setup

```bash
# Install dependencies
npm install
```

## Development

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The widget will be available at `http://localhost:5173`

### Development Configuration

The development server is configured to proxy API requests to a local WordPress installation:

- API proxy: `http://localhost:8888/wp-json` (configured in `vite.config.js`)
- Development mode uses Vite's HMR for instant updates

### Code Quality

```bash
# Lint and auto-fix code
npm run lint

# Format code with Prettier
npm run format
```

## Building

### Production Build

Build the widget for production as a standalone application:

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### Library Build

Build the widget as a library (Web Component + Vue component):

```bash
npm run build:lib
```

This creates:
- `dist/bookiflex-booking-widget.umd.js` - UMD bundle for direct browser usage
- `dist/bookiflex-booking-widget.es.js` - ES module for modern bundlers
- `dist/style.css` - Bundled styles

## Usage

### As a Web Component

The widget automatically registers itself as a custom element when loaded:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dist/style.css">
</head>
<body>
  <!-- Basic usage -->
  <bflex-booking-widget
    start="2025-01-15"
    end="2025-01-20"
  ></bflex-booking-widget>

  <!-- With promo code -->
  <bflex-booking-widget
    start="2025-02-01"
    end="2025-02-05"
    promo-code="SPRING2025"
  ></bflex-booking-widget>

  <script src="dist/bookiflex-booking-widget.umd.js"></script>
</body>
</html>
```

### As a Vue Component

```vue
<script setup>
import { BookingWidget } from 'bookiflex-booking-widget';
import 'bookiflex-booking-widget/dist/style.css';

const startDate = '2025-01-15';
const endDate = '2025-01-20';
const promoCode = 'WINTER2025';
</script>

<template>
  <BookingWidget
    :start="startDate"
    :end="endDate"
    :promo-code="promoCode"
  />
</template>
```

### Using the Mount Helper

```javascript
import { mountWidget } from 'bookiflex-booking-widget';
import 'bookiflex-booking-widget/dist/style.css';

// Mount the widget to a specific element
mountWidget({
  start: '2025-01-15',
  end: '2025-01-20',
  promoCode: 'SPRING2025'
});
```

## Widget Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `start` | String | `''` | Check-in date in YYYY-MM-DD format |
| `end` | String | `''` | Check-out date in YYYY-MM-DD format |
| `promo-code` | String | `null` | Promotional/discount code |
| `accommodation-types` | String | `''` | Comma-separated list of accommodation type IDs to filter |
| `rate-plans` | String | `''` | Comma-separated list of rate plan IDs to filter |
| `use-url-params` | Boolean | `false` | Enable reading URL parameters on widget initialization |
| `sync-url` | Boolean | `false` | Enable automatic URL synchronization when search parameters change |

## URL Parameters Support

The widget supports reading search parameters from the browser URL for deep linking, marketing campaigns, and shareable booking links.

### Enabling URL Parameters

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

### Supported URL Parameters

- `start` - Check-in date (YYYY-MM-DD)
- `end` - Check-out date (YYYY-MM-DD)
- `promoCode` - Promotional code
- `accommodationTypes` - Comma-separated accommodation type IDs
- `ratePlans` - Comma-separated rate plan IDs
- `cancel` - Reservation SID for cancellation (always supported)

### Example URLs

**Marketing campaign:**
```
https://hotel.com/?start=2025-12-20&end=2025-12-27&promoCode=XMAS2025
```

**Cancellation link:**
```
https://hotel.com/?cancel=RES123456
```

**Filtered search:**
```
https://hotel.com/?start=2025-01-15&end=2025-01-20&accommodationTypes=1,2,3
```

For detailed documentation on URL parameters, priority handling, and integration scenarios, see [URL_PARAMETERS.md](docs/URL_PARAMETERS.md).

## Events API

The widget emits custom events that parent applications can listen to. See [CUSTOM_EVENTS.md](docs/CUSTOM_EVENTS.md) for detailed documentation.

### Emitted Events

```javascript
// Widget is ready
window.addEventListener('bflex:booking-widget:ready', (e) => {
  console.log('Widget ready');
});

// Search parameters changed
window.addEventListener('bflex:booking-widget:changed', (e) => {
  const { start, end, promoCode } = e.detail;
  console.log('Search updated:', start, end, promoCode);
});

// User navigated to a different page
window.addEventListener('bflex:booking-widget:action', (e) => {
  const { action } = e.detail;
  console.log('Page:', action);
});

// Widget removed
window.addEventListener('bflex:booking-widget:removed', () => {
  console.log('Widget removed');
});
```

### Controlling the Widget

```javascript
// Update search parameters
window.dispatchEvent(new CustomEvent('bflex:search-bar:search', {
  detail: {
    start: '2025-03-01',
    end: '2025-03-05',
    promoCode: 'SPRING2025'
  }
}));
```

## Booking Flow

The widget implements a multi-step booking flow:

1. **Offers Page** (`OffersPage.vue`)
   - Display available accommodations
   - Show rate plans and pricing variants
   - Select occupancy and add to cart

2. **Confirmation Page** (`ConfirmationPage.vue`)
   - Enter customer information
   - Review booking details
   - Select payment method
   - Add special requests
   - Accept terms and conditions

3. **Result Page** (`ResultPage.vue`)
   - Show reservation confirmation
   - Display booking details
   - Payment instructions (if applicable)
   - Next steps information

4. **Cancellation Page** (`CancellationPage.vue`) (Optional)
   - Enter cancellation code
   - Review cancellation policy
   - Confirm cancellation

## Architecture

### State Management

The widget uses Vue 3 Composition API with custom composables for state management:

- **useBookingFlow**: Manages page navigation and booking flow state
- **useCart**: Handles cart operations (add, remove, update, confirm)
- **useOffers**: Fetches and manages accommodation offers
- **useReservation**: Handles reservation operations (fetch, cancel)
- **useLoading**: Global loading state management

### Service Layer

Business logic is separated into service modules:

- **cart.service.js**: Cart API operations
- **offers.service.js**: Offers fetching and filtering
- **reservation.service.js**: Reservation CRUD operations

### Component Architecture

- **Pages**: Top-level components representing booking steps
- **Components**: Reusable domain components (cards, forms, etc.)
- **UI Components**: Generic, reusable UI elements (buttons, inputs, loaders)
- **Information Blocks**: Specialized layout components

## API Integration

The widget communicates with the BookiFlex WordPress REST API:

- **Base URL**: Configured via proxy in development (`/wp-json/bookiflex/v1/`)
- **Endpoints**:
  - `GET /init` - Initialize widget settings
  - `GET /offers` - Fetch accommodation offers
  - `POST /cart/add` - Add item to cart
  - `GET /cart` - Get cart contents
  - `POST /cart/{hash}/update` - Update cart item
  - `POST /cart/{hash}/delete` - Remove cart item
  - `POST /cart/confirm` - Confirm booking
  - `GET /reservation/{sid}` - Get reservation details
  - `POST /reservation/{sid}/cancel` - Cancel reservation

## Internationalization

The widget uses WordPress i18n functions for translations:

```javascript
import { __ } from '@wordpress/i18n';

const text = __('Book Now', 'bookiflex');
```

All translatable strings use the `bookiflex` text domain.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES6+ support

## License

See project license file.
