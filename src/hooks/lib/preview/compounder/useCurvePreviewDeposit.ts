import { Address, useContractRead, useContractReads } from "wagmi"

import { VaultType } from "@/lib/types"
import useCalcTokenAmount from "@/hooks/lib/preview/compounder/useCalcTokenAmount"
import { useVaultContract } from "@/hooks/lib/useVaultContract"
import { useActiveChainId } from "@/hooks/useActiveChainId"

import { CurvePool2Assets, CurvePool3Assets } from "@/constant/abi"
import {
  ARBI_CURVE_ADDRESS,
  crvTriCryptoPoolAddress,
  crvTwoCryptoTokenAddress,
  ETH,
  fraxBpTokenAddress,
  WETH,
  WETH_ARBI,
} from "@/constant/addresses"

export default function useCurvePreviewDeposit({
  asset,
  vaultAddress,
  token,
  amount,
  type,
  slippage,
  enabled,
}: {
  asset: Address
  vaultAddress: Address
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

  if (token === ETH && isArbitrumFamily) {
    token = WETH_ARBI
  }
  if (token === ETH && !isArbitrumFamily) {
    token = WETH
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
  const underlyingAssetsAmount = underlyingAssets.data
    ?.filter((x) => x !== "0x")
    .map((x, i) => (index === i ? BigInt(amount) : BigInt(0)))
  const isCurveEnabled = type === "curve" && enabled

  const amountLp = useCalcTokenAmount({
    asset,
    assets: underlyingAssetsAmount ?? [],
    isDeposit: true,
    enabled: isCurveEnabled && !!underlyingAssetsAmount && enabled,
  })

  const amountLpValue = amountLp.data ?? 0n
  const amountLpWithSlippage = Number(amountLpValue) * (1 + slippage)

  const preview = useContractRead({
    ...useVaultContract(vaultAddress),
    enabled: isCurveEnabled && enabled,
    functionName: "previewDeposit",
    args: [BigInt(parseInt(amountLpWithSlippage.toFixed(2)))],
  })

  // TODO: Balancer side

  //if(isCurveEnabled){
  return {
    ...preview,
    data: {
      minAmountWei: parseInt(amountLpWithSlippage.toFixed(2)),
      resultWei: preview.data ?? 0,
    },
  }
  //}
}
