import {
  CompounderPreviewTransactionBaseArgs,
  ConcentratorPreviewTransactionBaseArgs,
  PreviewTransactionBaseArgs,
} from "@/hooks/lib/api/types"
import { useCompounderPreviewDeposit } from "@/hooks/useCompounderPreviewDeposit"
import { useConcentratorPreviewDeposit } from "@/hooks/useConcentratorPreviewDeposit"
import { useIsCompounderProduct } from "@/hooks/useVaultProduct"

export function usePreviewDeposit(props: PreviewTransactionBaseArgs) {
  const isCompounderProduct = useIsCompounderProduct(
    props.productType ?? "compounder"
  )
  const compounderProps = props as CompounderPreviewTransactionBaseArgs
  const concentratorProps = props as ConcentratorPreviewTransactionBaseArgs

  const compounderPreviewDeposit = useCompounderPreviewDeposit({
    ...compounderProps,
    enabled: isCompounderProduct && props.enabled,
  })

  const concentratorPreviewDeposit = useConcentratorPreviewDeposit({
    ...concentratorProps,
    enabled: !isCompounderProduct && props.enabled,
  })

  if (isCompounderProduct) {
    return compounderPreviewDeposit
  }

  return concentratorPreviewDeposit
}
