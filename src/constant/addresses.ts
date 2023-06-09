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

export const WETH_ARBI: Address = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
export const WETH: Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
export const DAI_ARBI: Address = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
export const WBTC_ARBI: Address = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
export const LINK_ARBI: Address = "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4"
export const UNI_ARBI: Address = "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0"
export const USDC_ARBI: Address = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
export const USDT_ARBI: Address = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
export const FRAX_ARBI: Address = "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F"
export const GLP_ARBI: Address = "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258"

export const ARBI_CURVE_ADDRESS: Record<Address, Address> = {
  [crvTriCryptoTokenAddress]: crvTriCryptoPoolAddress,
  [crvTwoCryptoTokenAddress]: crvTwoCryptoTokenAddress,
  [fraxBpTokenAddress]: fraxBpTokenAddress,
}
