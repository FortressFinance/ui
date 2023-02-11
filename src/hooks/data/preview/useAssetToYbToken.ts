import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useBalancerAssetToYbToken } from "@/hooks/data/preview/useBalancerAssetToYbToken"
import { useCurveAssetToYbToken } from "@/hooks/data/preview/useCurveAssetToYbToken"
import { useTokenAssetToYbToken } from "@/hooks/data/preview/useTokenAssetToYbToken"
import { useIsCurveCompounder, useIsTokenCompounder } from "@/hooks/useVaultTypes"

import { useTxSettings } from "@/store/txSettings"

import { DEFAULT_SLIPPAGE } from "@/constant/env"

export function useAssetToYbToken({
  chainId,
  id,
  token = "0x",
  amount,
  type
}: {
  chainId: number
  id: number | undefined
  token: Address | undefined,
  amount: string
  type: VaultType
}) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)

  const txSettings = useTxSettings()
  const slippage = parseFloat(
    txSettings.isSlippageAuto
      ? DEFAULT_SLIPPAGE.toFixed(2)
      : txSettings.slippageTolerance.toFixed(3)
  )
  
  const enableCurveAssetToYbToken = !isToken && isCurve
  const curvePreviewQuery = useCurveAssetToYbToken({
    chainId,
    id,
    token,
    amount,
    slippage,
    enabled: enableCurveAssetToYbToken
  })

  const enableBalancerAssetToYbToken = !isToken && !isCurve
  const balancerPreviewQuery = useBalancerAssetToYbToken({
    chainId,
    id,
    token,
    amount,
    slippage,
    enabled: enableBalancerAssetToYbToken
  })

  const enableTokenAssetToYbToken = isToken
  const tokenPreviewQuery = useTokenAssetToYbToken({
    chainId,
    id,
    token,
    amount,
    enabled: enableTokenAssetToYbToken
  })

  if(amount === "0"){
    // avoid render infinite loop
    return {
      isLoading: false,
      data: {
        resultFormated: "0,0"
      }
    }
  }

  if(!curvePreviewQuery.isError)
  {
    return curvePreviewQuery
  }

  if(!balancerPreviewQuery.isError)
  {
    return balancerPreviewQuery
  }

  return tokenPreviewQuery
}