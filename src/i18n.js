import { createI18n } from 'vue-i18n'
import l10n from './l10n.js'

export default createI18n({
  legacy: false,
  fallbackLocale: 'en',
  locale: 'en',
  messages: l10n
})
