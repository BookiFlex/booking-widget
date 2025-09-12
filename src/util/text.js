const convertStatus = (status) => {
  return status.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export { convertStatus }
