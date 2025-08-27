# Project: BookiFlex Booking Widget

## Project Overview

This project is a booking widget built with Vue 3 and Vite. It is designed to be used as a web component (`bflex-booking-widget`) or mounted directly into a web page. The widget communicates with a WordPress backend to handle the booking process, which includes selecting accommodations, confirming bookings, and viewing reservation details.

**Key Technologies:**

*   **Frontend:** Vue 3, Vite, Vue I18n, SASS
*   **Backend:** WordPress (communication via REST API)
*   **Architecture:** Web component-based architecture, allowing for easy integration into any web page.

## Building and Running

### Installation

```bash
npm install
```

### Development

To run the development server with hot-reloading:

```bash
npm run dev
```

This will start the server and proxy API requests to a WordPress backend running at `http://localhost:8888`.

### Production Build

To build the application for production:

```bash
npm run build
```

To build the application as a library (web component):

```bash
npm run build:lib
```

### Linting and Formatting

To lint the code with ESLint:

```bash
npm run lint
```

To format the code with Prettier:

```bash
npm run format
```

## Development Conventions

*   **Web Components:** The primary way to use the widget is as a web component (`<bflex-booking-widget>`). The `src/BookingWidget.ce.vue` component is the entry point for the custom element.
*   **State Management:** The project uses Vue's reactivity system (`ref`, `provide`, `inject`) for state management.
*   **API Communication:** All communication with the WordPress backend is handled through the `src/api/api.js` module. The API endpoints are defined in this file.
*   **Styling:** The project uses SASS for styling. The main stylesheet is `src/assets/css/index.scss`.
*   **Internationalization:** The project uses `vue-i18n` for internationalization. The translation files are located in the `src/locales` directory (although not explicitly seen, it's a standard convention).
*   **Custom Events:** The widget uses custom events to communicate with the host page (e.g., `bflex:booking-widget:ready`, `bflex:booking-widget:changed`).
