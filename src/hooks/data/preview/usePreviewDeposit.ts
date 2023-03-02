import { Address } from "wagmi"

import { PreviewData } from "@/lib/api/vaults"
import { VaultType } from "@/lib/types"
import {
  useBalancerPreviewDeposit,
  useCurvePreviewDeposit,
  useTokenPreviewDeposit,
} from "@/hooks/data/preview"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

import { useTxSettings } from "@/store/txSettings"

export function usePreviewDeposit({
  chainId,
  id,
  token = "0x",
  amount,
  type,
  enabled,
  onSuccess,
  onError,
}: {
  chainId: number
  id: number | undefined
  token: Address | undefined
  amount: string
  type: VaultType
  enabled: boolean
  onSuccess: ((data: PreviewData) => void) | undefined
  onError: ((err: unknown) => void) | undefined
}) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)

  const slippage = useTxSettings((store) => store.slippageTolerance)

  const enableCurveAssetToYbToken = !isToken && isCurve
  const curvePreviewQuery = useCurvePreviewDeposit({
    chainId,
    id,
    token,
    amount,
    slippage,
    enabled: enabled && enableCurveAssetToYbToken,
    onSuccess,
    onError,
  })

  const enableBalancerAssetToYbToken = !isToken && !isCurve
  const balancerPreviewQuery = useBalancerPreviewDeposit({
    chainId,
    id,
    token,
    amount,
    slippage,
    enabled: enabled && enableBalancerAssetToYbToken,
    onSuccess,
    onError,
  })

  const enableTokenAssetToYbToken = isToken
  const tokenPreviewQuery = useTokenPreviewDeposit({
    chainId,
    id,
    token,
    amount,
    enabled: enabled && enableTokenAssetToYbToken,
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
