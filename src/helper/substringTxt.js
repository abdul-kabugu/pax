export const truncateString = (string, number) => {
  if(string.length <= number) {
    return  string
  }
  return string.slice(0, number) + '...'
}