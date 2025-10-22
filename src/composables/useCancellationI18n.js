// Translation keys mapped to WordPress i18n
const translations = {
  nonRefundableRateFull: window.wp.i18n.__('Non-refundable rate: 100%% penalty applies at any time', 'bookiflex'),
  freeCancellationAtAnyTime: window.wp.i18n.__('Free cancellation at any time', 'bookiflex'),
  freeCancellationBefore: window.wp.i18n.__('Free cancellation if cancelled more than %d hours before check-in', 'bookiflex'),
  freeCancellationBetween: window.wp.i18n.__('Free cancellation between %d and %d hours before check-in', 'bookiflex'),
  penaltyWithinHours: window.wp.i18n.__('%s if cancelled within %d hours of check-in', 'bookiflex'),
  penaltyBetweenHours: window.wp.i18n.__('%s if cancelled between %d and %d hours before check-in', 'bookiflex'),
  freeCancellationUntilDate: window.wp.i18n.__('Free cancellation until %s', 'bookiflex'),
  freeCancellationFromDate: window.wp.i18n.__('Free cancellation from %s onwards', 'bookiflex'),
  freeCancellationBetweenDates: window.wp.i18n.__('Free cancellation between %s and %s', 'bookiflex'),
  penaltyAfterDate: window.wp.i18n.__('%s if cancelled after %s', 'bookiflex'),
  penaltyBetweenDates: window.wp.i18n.__('%s if cancelled between %s and %s', 'bookiflex'),
  penaltyNoShow: window.wp.i18n.__('%s for no-show (after check-in time)', 'bookiflex'),
  penaltyNoShowDate: window.wp.i18n.__('%s for no-show or cancellation after %s', 'bookiflex'),
  percentageCharge: window.wp.i18n.__('%d%% charge', 'bookiflex'),
  fixedFee: window.wp.i18n.__('%s%s fee', 'bookiflex'),
  nightCharge: window.wp.i18n.__('%d night charge', 'bookiflex'),
  nightsCharge: window.wp.i18n.__('%d nights charge', 'bookiflex')
}

export function useCancellationI18n() {
  // Format penalty amount text
  function formatRuleDescription({ text, params }) {
      const key = resolveKey(text)

      if (Array.isArray(params?.penalty)) {
        params = {
          ...params,
          penalty: params.penalty
            .map((p) => formatRuleDescription({ text: p.text, params: p.params ?? {} }))
            .join(' + '),
        }
      }

      return formatTranslation(key, params ?? {})
  }

  function formatTranslation(key, params) {
    const template = translations[key]
    if (!template) {
      console.warn(`Missing translation for key: "${key}"`)
      return key
    }

    // Extract parameter values in correct order based on template
    const values = Object.values(params)

    if (values.length === 0) {
      return template
    }

    return window.wp.i18n.sprintf(template, ...values)
  }

  /**
   * Преобразует текст шаблона из API в ключ из i18n-файла
   */
  function resolveKey(text) {
    const map = {
      'Non-refundable rate: 100% penalty applies at any time': 'cancellation.nonRefundableRateFull',
      'Free cancellation at any time': 'cancellation.freeCancellationAtAnyTime',
      'Free cancellation if cancelled more than {hours} hours before check-in': 'cancellation.freeCancellationBefore',
      'Free cancellation between {minHours} and {maxHours} hours before check-in': 'cancellation.freeCancellationBetween',
      '{penalty} if cancelled within {hours} hours of check-in': 'cancellation.penaltyWithinHours',
      '{penalty} if cancelled between {minHours} and {maxHours} hours before check-in': 'cancellation.penaltyBetweenHours',
      'Free cancellation until {date}': 'cancellation.freeCancellationUntilDate',
      'Free cancellation from {date} onwards': 'cancellation.freeCancellationFromDate',
      'Free cancellation between {minDate} and {maxDate}': 'cancellation.freeCancellationBetweenDates',
      '{penalty} if cancelled after {date}': 'cancellation.penaltyAfterDate',
      '{penalty} if cancelled between {minDate} and {maxDate}': 'cancellation.penaltyBetweenDates',
      '{penalty} for no-show (after check-in time)': 'cancellation.penaltyNoShow',
      '{penalty} for no-show or cancellation after {date}': 'cancellation.penaltyNoShowDate',

      '{percentage}% charge': 'cancellation.percentageCharge',
      '{currency}{amount} fee': 'cancellation.fixedFee',
      '{nights} night charge': 'cancellation.nightCharge',
      '{nights} nights charge': 'cancellation.nightsCharge',
    }

    const key = map[text]
    if (!key) {
      console.warn(`Missing translation key for: "${text}"`)
      return text // fallback: вернём оригинал, если не нашли
    }

    return key
  }

  return {
    formatRuleDescription
  };
}
