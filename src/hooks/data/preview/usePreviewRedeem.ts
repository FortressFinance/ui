import { Address } from "wagmi"

import { PreviewData } from "@/lib/api/vaults"
import { VaultType } from "@/lib/types"
import {
  useBalancerPreviewRedeem,
  useCurvePreviewRedeem,
  useTokenPreviewRedeem,
} from "@/hooks/data/preview"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

import { useTxSettings } from "@/store/txSettings"

export function usePreviewRedeem({
  chainId,
  id,
  token = "0x",
  amount,
  type,
  enabled = true,
  onSuccess,
  onError,
}: {
  chainId: number
  id?: number
  token?: Address
  amount: string
  type: VaultType
  enabled?: boolean
  onSuccess?: (data: PreviewData) => void
  onError?: (err: unknown) => void
}) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)

  const slippage = useTxSettings((store) => store.slippageTolerance)

  const enableCurveAssetToYbToken = enabled && !isToken && isCurve
  const curvePreviewQuery = useCurvePreviewRedeem({
    chainId,
    id,
    token,
    amount,
    slippage,
    enabled: enableCurveAssetToYbToken,
    onSuccess,
    onError,
  })

  const enableBalancerAssetToYbToken = enabled && !isToken && !isCurve
  const balancerPreviewQuery = useBalancerPreviewRedeem({
    chainId,
    id,
    token,
    amount,
    slippage,
    enabled: enableBalancerAssetToYbToken,
    onSuccess,
    onError,
  })

  const enableTokenAssetToYbToken = enabled && isToken
  const tokenPreviewQuery = useTokenPreviewRedeem({
    chainId,
    id,
    token,
    amount,
    enabled: enableTokenAssetToYbToken,
    onSuccess,
    onError,
  })

  if (enableCurveAssetToYbToken) {
    return curvePreviewQuery
  }

  if (enableBalancerAssetToYbToken) {
    return balancerPreviewQuery
  }

  return tokenPreviewQuery
}
