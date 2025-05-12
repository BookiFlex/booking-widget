function formatDateRange(startDate, endDate, locale = 'en-GB') {
  // const optionsSameMonth = { day: 'numeric' }
  const optionsDifferentMonth = { day: 'numeric', month: 'short' }
  const optionsDifferentYear = { day: 'numeric', month: 'short', year: 'numeric' }

  const start = new Date(startDate)
  const end = new Date(endDate)

  const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()
  const sameYear = start.getFullYear() === end.getFullYear()

  if (sameMonth) {
    return `${start.toLocaleDateString(locale, optionsDifferentMonth)} — ${end.toLocaleDateString(locale, optionsDifferentMonth)} ${end.getFullYear()}`
  } else if (sameYear) {
    return `${start.toLocaleDateString(locale, optionsDifferentMonth)} — ${end.toLocaleDateString(locale, optionsDifferentMonth)} ${end.getFullYear()}`
  } else {
    return `${start.toLocaleDateString(locale, optionsDifferentYear)} — ${end.toLocaleDateString(locale, optionsDifferentYear)}`
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

function getStartEndDates() {
  const now = new Date()

  const startDate = new Date(now)
  startDate.setDate(now.getDate() + 1)

  const endDate = new Date(now)
  endDate.setDate(now.getDate() + 2)

  const formatDate = (date) => date.toISOString().split('T')[0]

  return {
    start: formatDate(startDate),
    end: formatDate(endDate),
  }
}

function timeRangeGenerator(start, end, step = 60) {
  const result = []

  const [startHour, startMinute] = start.split(':').map(Number)
  const [endHour, endMinute] = end.split(':').map(Number)

  const startDate = new Date()
  startDate.setHours(startHour, startMinute, 0, 0)

  const endDate = new Date()
  endDate.setHours(endHour, endMinute, 0, 0)

  const current = new Date(startDate)

  while (current <= endDate) {
    const hours = current.getHours().toString().padStart(2, '0')
    const minutes = current.getMinutes().toString().padStart(2, '0')
    result.push(`${hours}:${minutes}`)
    current.setMinutes(current.getMinutes() + step)
  }

  return result
}

export { formatDateRange, lengthOfStay, getStartEndDates, timeRangeGenerator }
