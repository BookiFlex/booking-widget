import { useI18n } from 'vue-i18n'

export function useFormattedCancellationPolicy() {
  const { t } = useI18n()

  function formatDescription(description) {
    return description.map(ruleParts => {
      return ruleParts
        .map(part => {
          const key = resolveKey(part.text)
          return t(key, part.params || {})
        })
        .join('') // Склеиваем части одного правила
    })
  }

  return { formatDescription }
}

/**
 * Преобразует текст шаблона из API в ключ из i18n-файла
 */
function resolveKey(text) {
  const map = {
    'Free cancellation': 'cancellationPolicy.free',
    'Paid cancellation': 'cancellationPolicy.paid',
    'Free cancellation is possible before {date}': 'cancellationPolicy.beforeFree',
    'If the cancellation is made after {date}, a penalty of ': 'cancellationPolicy.afterPenaltyStart',
    '{days} days of the booking cost': 'cancellationPolicy.penalty.days',
    '{fixedPenalty}': 'cancellationPolicy.penalty.fixed',
    '{penaltyPercentage}% of the booking cost': 'cancellationPolicy.penalty.percent',
    '{penaltyPercentage}% of the booking cost + {fixedPenalty}': 'cancellationPolicy.penalty.percentAndFixed',
    '{days} days of the booking cost + {fixedPenalty}': 'cancellationPolicy.penalty.daysAndFixed',
  }

  const key = map[text]
  if (!key) {
    console.warn(`Missing translation key for: "${text}"`)
    return text // fallback: вернём оригинал, если не нашли
  }

  return key
}

const prepareText = (parts) => {
  return parts
    .map(({ text, params }) => {
      let formatted = text
      for (const param of params) {
        formatted = formatted.replace('%s', param)
      }
      return formatted
    })
    .join('')
}

export { prepareText }
