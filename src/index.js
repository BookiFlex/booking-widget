import { createApp, defineCustomElement } from 'vue'
import BookingWidgetCE from './BookingWidget.ce.vue'
import BookingWidget from './BookingWidget.vue'
import App from './App.vue'

if (globalThis.window) {
  window.customElements.define('bflex-booking-widget', defineCustomElement(BookingWidgetCE))
}

function mountWidget(initOptions) {
  const app = createApp(App, { initOptions })
  app.mount('#bflex-booking-widget')
}

export { BookingWidget, mountWidget }

export {}
