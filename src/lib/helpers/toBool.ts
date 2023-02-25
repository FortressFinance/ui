const toBool = (val: string | boolean | number | undefined | null): boolean => {
  const s = val && val.toString().toLowerCase().trim()
  if (s == "true" || s == "1") return true
  return false
}
export { toBool }
