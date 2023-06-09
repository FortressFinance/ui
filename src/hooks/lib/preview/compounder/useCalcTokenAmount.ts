import { Address, useContractRead } from "wagmi"

import { useActiveChainId } from "@/hooks/useActiveChainId"

import { CurvePool2Assets, CurvePool3Assets } from "@/constant/abi"
import {
  ARBI_CURVE_ADDRESS,
  crvTriCryptoPoolAddress,
  crvTwoCryptoTokenAddress,
  fraxBpTokenAddress,
} from "@/constant/addresses"

export default function useCalcTokenAmount({
  asset,
  assets,
  isDeposit,
  enabled,
}: {
  asset: Address
  assets: bigint[]
  isDeposit: boolean
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const poolCurveAddress = ARBI_CURVE_ADDRESS[asset] ?? "0x"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let abi: any = undefined
  if (poolCurveAddress === crvTriCryptoPoolAddress) {
    abi = CurvePool3Assets
  }
  if (poolCurveAddress === crvTwoCryptoTokenAddress) {
    abi = CurvePool2Assets
  }
  if (poolCurveAddress === fraxBpTokenAddress) {
    abi = CurvePool2Assets
  }

  return useContractRead({
    chainId,
    abi,
    address: poolCurveAddress,
    enabled: !!asset && enabled,
    functionName: "calc_token_amount",
    args: [assets, isDeposit],
  })
}
