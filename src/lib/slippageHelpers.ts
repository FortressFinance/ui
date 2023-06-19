// returns a new bigint that is the percentage of the amount
// percentage expressed out of 10000 (e.g. 1 = 0.001%, 10 = 0.01%, 100 = 0.1%, 1000 === 1%, 100000 === 100%)
export const percentageOfBigInt = (amount = 0n, percentage = 0) =>
  amount >= 100000n ? (amount * BigInt(Math.floor(percentage))) / 100000n : 0n

// returns a new bigint with a slippage percentage added
// percentage expressed out of 100 (e.g. 0.001 = 0.001%, 0.01 = 0.01%, 0.1 = 0.1%, 1 = 1%, 100 = 100%)
export const addSlippage = (amount = 0n, slippage = 0) =>
  amount + percentageOfBigInt(amount, slippage * 1000)

// returns a new bigint with a slippage percentage subtracted
// percentage expressed out of 100 (e.g. 0.001 = 0.001%, 0.01 = 0.01%, 0.1 = 0.1%, 1 = 1%, 100 = 100%)
export const subSlippage = (amount = 0n, slippage = 0) =>
  amount - percentageOfBigInt(amount, slippage * 1000)
