export function convertToApy(apr?: number) {
  const compoundPeriod = 84_600 * 7 // 7 days - 1 week
  const yearInSecond = 31_556_926
  const n = yearInSecond / compoundPeriod

  return apr === undefined ? 0 : (1 + apr / n) ** n - 1
}

export function concentratorConvertToApy(
  concentratorApr?: number,
  compounderApy?: number
) {
  const compoundPeriod = 84_600 * 7 // 7 days - 1 week
  const yearInSecond = 31_556_926
  const n = yearInSecond / compoundPeriod
  return concentratorApr === undefined || compounderApy === undefined
    ? 0
    : concentratorApr * (((1 + compounderApy / n) ** n - 1) / compounderApy)
}
