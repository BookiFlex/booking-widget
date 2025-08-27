export function formatMoney(cents, currencyCode = 'USD') {
  const amount = cents / 100;

  try {
    // Пытаемся использовать встроенное форматирование
    const formatter = new Intl.NumberFormat(window.navigator.language, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formatter.format(amount);
  // eslint-disable-next-line no-unused-vars
  } catch (_) {
    // Fallback
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

export function discountCalculator(current, old) {
  return Math.round((old - current) / (old / 100))
}
