import {
  CompounderPreviewTransactionBaseArgs,
  ConcentratorPreviewTransactionBaseArgs,
  PreviewTransactionBaseArgs,
} from "@/hooks/lib/api/types"
import { useCompounderPreviewRedeem } from "@/hooks/useCompounderPreviewRedeem"
import { useConcentratorPreviewRedeem } from "@/hooks/useConcentratorPreviewRedeem"
import { useIsCompounderProduct } from "@/hooks/useVaultProduct"

export function usePreviewRedeem(props: PreviewTransactionBaseArgs) {
  const isCompounderProduct = useIsCompounderProduct(
    props.productType ?? "compounder"
  )
  const compounderProps = props as CompounderPreviewTransactionBaseArgs
  const concentratorProps = props as ConcentratorPreviewTransactionBaseArgs

  const compounderRedeemDeposit = useCompounderPreviewRedeem({
    ...compounderProps,
    enabled: isCompounderProduct && props.enabled,
  })

  const concentratorRedeemDeposit = useConcentratorPreviewRedeem({
    ...concentratorProps,
    enabled: !isCompounderProduct && props.enabled,
  })

  if (isCompounderProduct) {
    return compounderRedeemDeposit
  }

  return concentratorRedeemDeposit
}
