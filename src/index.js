import { createApp, defineCustomElement } from 'vue'
import BookingWidgetCE from './BookingWidget.ce.vue'
import BookingWidget from './BookingWidget.vue'
import App from './App.vue'
import i18n from '@/i18n.js'

if (globalThis.window) {
  window.customElements.define('bflex-booking-widget', defineCustomElement(BookingWidgetCE))
}

function mountWidget(initOptions) {
  createApp(App, { initOptions })
    .use(i18n)
    .mount('#bflex-booking-widget')
}

export { BookingWidget, mountWidget }

export {}
