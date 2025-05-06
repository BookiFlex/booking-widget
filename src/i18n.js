import { createI18n } from 'vue-i18n'
import l10n from './l10n.js'

const locale = (globalThis.window && window?.BookiFlex?.widget?.locale)
  ? window.BookiFlex.widget.locale
  : 'en'

let messages = l10n;
if (globalThis.window && window?.BookiFlex?.widget?.l10n) {
  messages = Object.assign(messages, window?.BookiFlex?.widget?.l10n)
}

export default createI18n({
  legacy: false,
  fallbackLocale: 'en',
  locale,
  messages
})
