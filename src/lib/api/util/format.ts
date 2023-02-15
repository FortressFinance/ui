
import _Big from 'big.js'
import _Decimal from 'decimal.js-light'
import invariant from 'tiny-invariant'
import toFormat from 'toformat'

const Decimal = toFormat(_Decimal)
const Big = toFormat(_Big)

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: Decimal.ROUND_UP
}

const toFixedRounding = {
  [Rounding.ROUND_DOWN]: Big.roundDown,
  [Rounding.ROUND_HALF_UP]: Big.roundHalfUp,
  [Rounding.ROUND_UP]: Big.roundUp
}

export const toSignificant = (
  value: string,
  significantDigits: number,
  format: object = { groupSeparator: '' },
  rounding: Rounding = Rounding.ROUND_HALF_UP
): string => {
  invariant(!isNaN(Number(value)), `${value} is not an number.`)
  invariant(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`)
  invariant(significantDigits > 0, `${significantDigits} is not positive.`)

  Decimal.set({ precision: significantDigits + 1, rounding: toSignificantRounding[rounding] })
  const quotient = new Decimal(value)
    .toSignificantDigits(significantDigits)
  return quotient.toFormat(quotient.decimalPlaces(), format)
}

export const toFixed = (
  value: string,
  decimalPlaces: number,
  format: object = { groupSeparator: '' },
  rounding: Rounding = Rounding.ROUND_HALF_UP
): string => {
  invariant(!isNaN(Number(value)), `${value} is not an number.`)
  invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`)
  invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`)

  Big.DP = decimalPlaces
  Big.RM = toFixedRounding[rounding]
  return new Big(value).toFormat(decimalPlaces, format)
}