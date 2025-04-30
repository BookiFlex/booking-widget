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
