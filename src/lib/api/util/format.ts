import z from "zod"

// validates that a passed value can be coerced to a number (i.e. "2")
const valueSchema = z.coerce.number()
// validates that the value is an integer greater than 0
const parameterSchema = z.number().int().gt(0)

export const toSignificant = (
  value: string,
  significantDigits: number
): string => {
  // will throw if it doesn't match schema
  valueSchema.parse(value)
  // will throw if it doesn't match schema
  parameterSchema.parse(significantDigits)

  const numericValue = Number(value)
  return numericValue.toLocaleString("en-US", {
    maximumSignificantDigits: significantDigits,
    useGrouping: true,
  })
}

export const toFixed = (value: string, decimalPlaces: number): string => {
  // will throw if it doesn't match schema
  valueSchema.parse(value)
  // will throw if it doesn't match schema
  parameterSchema.parse(decimalPlaces)

  const numericValue = Number(value)
  return numericValue.toLocaleString("en-US", {
    maximumFractionDigits: decimalPlaces,
    useGrouping: true,
  })
}
