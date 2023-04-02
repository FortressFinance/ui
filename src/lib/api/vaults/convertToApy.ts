export async function convertToApy(apr: number | undefined) {
  const compoundPeriod = 84_600 * 7 // 7 days - 1 week
  const yearInSecond = 31_556_926
  const n = yearInSecond / compoundPeriod

  const totalApr = apr ?? 0
  return (1 + totalApr / n) ** n - 1
}
