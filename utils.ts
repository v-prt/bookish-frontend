export const sanitizeText = (text: string) => {
  return (
    text
      // trim whitespace
      .trim()
      // replace spaces with +
      .replace(/\s/g, '+')
      // replace multiple + with single +
      .replace(/\++/g, '+')
  )
}
