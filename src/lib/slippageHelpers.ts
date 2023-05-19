// returns a new bigint that is the percentage of the amount
// percentage expressed out of 100 (e.g. 0.05 = 0.05%, 5 === 5%, 95 === 95%)
export const percentageOfBigInt = (amount = 0n, percentage = 0) =>
  (amount * BigInt(percentage * 1000)) / BigInt(10000)

// returns a new bigint with a slippage percentage added
// percentage expressed out of 100 (e.g. 0.05 = 0.05%, 5 === 5%, 95 === 95%)
export const addSlippage = (amount = 0n, slippage = 0) =>
  amount + percentageOfBigInt(amount, slippage)

// returns a new bigint with a slippage percentage subtracted
// percentage expressed out of 100 (e.g. 0.05 = 0.05%, 5 === 5%, 95 === 95%)
export const subSlippage = (amount = 0n, slippage = 0) =>
  amount - percentageOfBigInt(amount, slippage)
