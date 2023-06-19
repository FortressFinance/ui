import { Address, useContractRead, useContractReads } from "wagmi"

import { VaultType } from "@/lib/types"
import { useVaultContract } from "@/hooks/lib/useVaultContract"
import { useActiveChainId } from "@/hooks/useActiveChainId"

import { CurvePool2Assets, CurvePool3Assets } from "@/constant/abi"
import {
  ARBI_CURVE_ADDRESS,
  crvTriCryptoPoolAddress,
  ETH,
} from "@/constant/addresses"

const WETH_ARBI: Address = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
const WETH: Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

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
  enabled?: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
  const poolCurveAddress = ARBI_CURVE_ADDRESS[asset] ?? "0x"
  const curToken =
    token === ETH && isArbitrumFamily
      ? WETH_ARBI
      : token === ETH && !isArbitrumFamily
      ? WETH
      : token

  const underlyingAssets = useContractReads({
    contracts: [0, 1, 2, 3, 4].map((index) => ({
      address: poolCurveAddress,
      chainId,
      abi: CurvePool3Assets,
      functionName: "coins",
      args: [index],
    })),
    enabled: poolCurveAddress !== "0x" && enabled,
    select: results => results.map(item => !item.error ? item.result : "0x"),
  })

  const index =
    underlyingAssets.data?.filter((x) => x !== "0x").indexOf(curToken ?? "0x") ??
    -1
  const underlyingAssetsAmount = underlyingAssets.data
    ?.filter((x) => x !== "0x")
    .map((x, i) => (index === i ? BigInt(amount) : 0n))
  const isCurveEnabled = type === "curve" && enabled

  const amountLp = useContractRead({
    chainId,
    abi: (poolCurveAddress === crvTriCryptoPoolAddress
      ? CurvePool3Assets
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        CurvePool2Assets) as any,
    address: poolCurveAddress,
    enabled:
      !!asset &&
      isCurveEnabled &&
      !!underlyingAssetsAmount &&
      index !== -1 &&
      enabled,
    functionName: "calc_token_amount",
    args: [underlyingAssetsAmount ?? [], true],
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
