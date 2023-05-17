export function convertToApy(apr?: number) {
  const compoundPeriod = 84_600 * 7 // 7 days - 1 week
  const yearInSecond = 31_556_926
  const n = yearInSecond / compoundPeriod

  return apr === undefined ? 0 : (1 + apr / n) ** n - 1
}

export function convertToApr(apy?: number) {
  const compoundPeriod = 84_600 * 7 // 7 days - 1 week
  const yearInSecond = 31_556_926
  const n = yearInSecond / compoundPeriod

  return apy === undefined ? 0 : (Math.pow(1 + apy, 1 / n) - 1) * n
}

export function concentratorConvertToApy(
  concentratorApr?: number,
  compounderApy?: number
) {
  if (concentratorApr === undefined) return 0
  if (compounderApy === undefined) return concentratorApr
  return concentratorApr * (convertToApy(compounderApy) / compounderApy)
}
