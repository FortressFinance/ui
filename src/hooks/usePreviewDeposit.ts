import { PreviewTransactionBaseArgs } from "@/hooks/lib/api/types"
import { useCompounderPreviewDeposit } from "@/hooks/useCompounderPreviewDeposit"
import { useConcentratorPreviewDeposit } from "@/hooks/useConcentratorPreviewDeposit"

export function usePreviewDeposit(props: PreviewTransactionBaseArgs) {
  const isCompounderProduct = props.productType === "compounder"

  const compounderPreviewDeposit = useCompounderPreviewDeposit({
    ...props,
    enabled: isCompounderProduct && props.enabled,
  })

  const concentratorPreviewDeposit = useConcentratorPreviewDeposit({
    ...props,
    enabled: !isCompounderProduct && props.enabled,
  })

  return isCompounderProduct
    ? compounderPreviewDeposit
    : concentratorPreviewDeposit
}
