import { Address } from "wagmi"

export const auraBalTokenAddress: Address =
  "0x616e8BfA43F920657B3497DBf40D6b1A02D4608d"
export const auraTokenAddress: Address =
  "0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF"
export const crvTriCryptoPoolAddress: Address =
  "0x960ea3e3C7FB317332d990873d354E18d7645590"
export const crvTriCryptoTokenAddress: Address =
  "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2"
export const crvTwoCryptoTokenAddress: Address =
  "0x7f90122BF0700F9E7e1F688fe926940E8839F353"
export const fraxBpTokenAddress: Address =
  "0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5"
export const ETH: Address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
export const glpRewardsDistributorAddress: Address =
  "0x5C04a12EB54A093c396f61355c6dA0B15890150d"
export const glpTokenAddress: Address =
  "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf"
export const multiClaimAddress: Address =
  "0x259c2B9F14Ef98620d529feEf6d0D22269fDfbeD"
export const glpVault: Address = "0x489ee077994B6658eAfA855C308275EAd8097C4A"

export const ARBI_CURVE_ADDRESS: Record<Address, Address> = {
  [crvTriCryptoTokenAddress]: crvTriCryptoPoolAddress,
  [crvTwoCryptoTokenAddress]: crvTwoCryptoTokenAddress,
  [fraxBpTokenAddress]: fraxBpTokenAddress,
}
