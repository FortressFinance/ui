import { Address } from "wagmi"

import { PreviewData } from "@/lib/api/vaults/getCompounderVaultsPreviewDeposit"
import { VaultType } from "@/lib/types"
import { useBalancerPreviewRedeem } from "@/hooks/data/preview/useBalancerPreviewRedeem"
import { useCurvePreviewRedeem } from "@/hooks/data/preview/useCurvePreviewRedeem"
import { useTokenPreviewRedeem } from "@/hooks/data/preview/useTokenPreviewRedeem"
import { useSlippageSetting } from "@/hooks/useSlippageSetting"
import { useIsCurveCompounder, useIsTokenCompounder } from "@/hooks/useVaultTypes"

export function usePreviewRedeem({
  chainId,
  id,
  token = "0x",
  amount,
  type,
  onSuccess,
  onError
}: {
  chainId: number
  id: number | undefined
  token: Address | undefined,
  amount: string
  type: VaultType
  onSuccess: ((data: PreviewData) => void) | undefined
  onError: ((err: unknown) => void) | undefined
}) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)

  const slippage = useSlippageSetting()
  
  const enableCurveAssetToYbToken = !isToken && isCurve
  const curvePreviewQuery = useCurvePreviewRedeem({
    chainId,
    id,
    token,
    amount,
    slippage,
    enabled: enableCurveAssetToYbToken,
    onSuccess,
    onError
  })

  const enableBalancerAssetToYbToken = !isToken && !isCurve
  const balancerPreviewQuery = useBalancerPreviewRedeem({
    chainId,
    id,
    token,
    amount,
    slippage,
    enabled: enableBalancerAssetToYbToken,
    onSuccess,
    onError
  })

  const enableTokenAssetToYbToken = isToken
  const tokenPreviewQuery = useTokenPreviewRedeem({
    chainId,
    id,
    token,
    amount,
    enabled: enableTokenAssetToYbToken,
    onSuccess,
    onError
  })

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