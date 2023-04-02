export function convertToApy(apr: number | undefined) {
  const compoundPeriod = 84_600 * 7 // 7 days - 1 week
  const yearInSecond = 31_556_926
  const n = yearInSecond / compoundPeriod

  return apr === undefined ? 0 : (1 + apr / n) ** n - 1
}
