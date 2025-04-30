function formatDateRange(startDate, endDate, locale = 'en-GB') {
  const optionsSameMonth = { day: 'numeric' }
  const optionsDifferentMonth = { day: 'numeric', month: 'short' }
  const optionsDifferentYear = { day: 'numeric', month: 'short', year: 'numeric' }

  const start = new Date(startDate)
  const end = new Date(endDate)

  const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()
  const sameYear = start.getFullYear() === end.getFullYear()

  if (sameMonth) {
    return `${start.toLocaleDateString(locale, optionsSameMonth)}-${end.toLocaleDateString(locale, optionsDifferentMonth)} ${end.getFullYear()}`
  } else if (sameYear) {
    return `${start.toLocaleDateString(locale, optionsDifferentMonth)} - ${end.toLocaleDateString(locale, optionsDifferentMonth)} ${end.getFullYear()}`
  } else {
    return `${start.toLocaleDateString(locale, optionsDifferentYear)} - ${end.toLocaleDateString(locale, optionsDifferentYear)}`
  }
}

function lengthOfStay(startDate, endDate, unit = 'nights') {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timeDiff = end - start
  const dayDiff = timeDiff / (1000 * 60 * 60 * 24)

  if (unit === 'nights') {
    return dayDiff
  } else if (unit === 'days') {
    return dayDiff + 1
  } else {
    throw new Error('Invalid unit. Use "nights" or "days".')
  }
}

export { formatDateRange, lengthOfStay }
