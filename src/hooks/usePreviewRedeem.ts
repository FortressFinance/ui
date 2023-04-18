import { PreviewTransactionBaseArgs } from "@/hooks/lib/api/types"
import { useCompounderPreviewRedeem } from "@/hooks/useCompounderPreviewRedeem"
import { useConcentratorPreviewRedeem } from "@/hooks/useConcentratorPreviewRedeem"

export function usePreviewRedeem(props: PreviewTransactionBaseArgs) {
  const isCompounderProduct = props.productType == "compounder"

  const compounderRedeemDeposit = useCompounderPreviewRedeem({
    ...props,
    enabled: isCompounderProduct && props.enabled,
  })

  const concentratorRedeemDeposit = useConcentratorPreviewRedeem({
    ...props,
    enabled: !isCompounderProduct && props.enabled,
  })

  if (isCompounderProduct) {
    return compounderRedeemDeposit
  }

  return concentratorRedeemDeposit
}
