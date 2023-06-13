import { Address, useContractRead, useContractReads } from "wagmi"

import { VaultType } from "@/lib/types"
import { useActiveChainId } from "@/hooks/useActiveChainId"

import { CurvePool2Assets, CurvePool3Assets } from "@/constant/abi"
import {
  ARBI_CURVE_ADDRESS,
  crvTriCryptoPoolAddress,
  ETH,
} from "@/constant/addresses"

const WETH_ARBI: Address = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
const WETH: Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

export default function useCurvePreviewRedeem({
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

  token =
    token === ETH && isArbitrumFamily
      ? WETH_ARBI
      : token === ETH && !isArbitrumFamily
      ? WETH
      : token

  const underlyingAssets = useContractReads({
    contracts: [0, 1, 2, 3, 4].map((index) => ({
      address: poolCurveAddress,
      chainId,
      abi: (poolCurveAddress === crvTriCryptoPoolAddress
        ? CurvePool3Assets
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          CurvePool2Assets) as any,
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

  const curvePreviewUnderlying = useCalcWithdrawOneCoin({
    asset,
    amount,
    index,
    enabled: isCurveEnabled && enabled,
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

function useCalcWithdrawOneCoin({
  asset,
  amount,
  index,
  enabled,
}: {
  asset: Address
  amount: string
  index: number
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const poolCurveAddress = ARBI_CURVE_ADDRESS[asset] ?? "0x"

  return useContractRead({
    chainId,
    abi: (poolCurveAddress === crvTriCryptoPoolAddress
      ? CurvePool3Assets
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        CurvePool2Assets) as any,
    address: poolCurveAddress,
    enabled: !!asset && enabled,
    functionName: "calc_withdraw_one_coin",
    args: [BigInt(amount), index],
  })
}
