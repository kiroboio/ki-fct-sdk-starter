export const truncate = (str: string, maxLength: number) => {
  if (str.length <= maxLength) return str
  return `${str.substring(0, maxLength)}...`
}

export const convertToSentenceCase = (str: string) => {
  // using regex to convert to sentence case
  const result = str.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}
