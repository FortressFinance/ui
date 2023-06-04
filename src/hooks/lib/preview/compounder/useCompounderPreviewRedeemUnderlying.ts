import { Address, useContractReads } from "wagmi"

import { VaultType } from "@/lib/types"
import useCalcWithdrawOneCoin from "@/hooks/lib/preview/compounder/useCalcWithdrawOneCoin"
import { useActiveChainId } from "@/hooks/useActiveChainId"

import { CurvePool2Assets, CurvePool3Assets } from "@/constant/abi"
import {
  ARBI_CURVE_ADDRESS,
  crvTriCryptoPoolAddress,
  crvTwoCryptoTokenAddress,
  ethTokenAddress,
  fraxBpTokenAddress,
  wethArbiTokenAddress,
  wethTokenAddress,
} from "@/constant/addresses"

export default function useCompounderPreviewRedeemUnderlying({
  asset,
  token,
  amount,
  type,
  slippage,
  enabled,
}: {
  asset: Address
  token?: Address
  amount: string
  type: VaultType
  slippage: number
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
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

  if (token === ethTokenAddress && isArbitrumFamily) {
    token = wethArbiTokenAddress
  }
  if (token === ethTokenAddress && !isArbitrumFamily) {
    token = wethTokenAddress
  }

  const underlyingAssets = useContractReads({
    contracts: [0, 1, 2, 3, 4].map((index) => ({
      address: poolCurveAddress,
      chainId,
      abi,
      functionName: "coins",
      args: [index],
    })),
    enabled: enabled,
    select: (results) =>
      results.map((item) => {
        return !item.error ? (item.result as unknown as Address) : "0x"
      }),
  })

  const index =
    underlyingAssets.data?.filter((x) => x !== "0x").indexOf(token ?? "0x") ??
    -1
  const isCurveEnabled = index !== -1 && type === "curve" && enabled
  //const isTokenEnabled = index !== -1 && type !== "curve" && enabled

  const curvePreviewUnderlying = useCalcWithdrawOneCoin({
    asset,
    amount,
    index,
    enabled: isCurveEnabled,
  })

  // TODO: Balancer side

  //if(isCurveEnabled){
  const preview = curvePreviewUnderlying.data ?? 0n
  const previewWithSlippage = Number(preview) * (1 + slippage)
  return {
    ...curvePreviewUnderlying,
    data: parseInt(previewWithSlippage.toFixed(2)),
  }
  //}
}
