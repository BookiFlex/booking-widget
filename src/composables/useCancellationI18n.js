import { useI18n } from 'vue-i18n'

export function useCancellationI18n() {
  const { t } = useI18n();

  // Format penalty amount text
  function formatRuleDescription({ text, params }) {
      const key = resolveKey(text)

      if (Array.isArray(params?.penalty)) {
        params = {
          ...params,
          penalty: params.penalty
            .map((p) => t(resolveKey(p.text), p.params ?? {}))
            .join(' + '),
        }
      }

      return t(key, params ?? {})
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
