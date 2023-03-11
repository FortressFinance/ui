import { useQuery } from "@tanstack/react-query"

import { getCompounderVaultsPreviewRedeem } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { PreviewVaultSpecificTransactionArgs } from "@/hooks/data/preview/types"

export function useCurvePreviewRedeem({
  enabled,
  onError,
  onSuccess,
  ...args
}: PreviewVaultSpecificTransactionArgs) {
  return useQuery({
    ...queryKeys.vaults.previewRedeem(args),
    queryFn: () => getCompounderVaultsPreviewRedeem({ ...args, isCurve: true }),
    retry: false,
    enabled,
    onSuccess,
    onError,
  })

  // Preview deposit method
  // const { isLoading: isLoadingPreview } = useContractRead({
  //   chainId,
  //   address: vaultAddress,
  //   abi: vaultCompounderAbi,
  //   functionName: "previewRedeem",
  //   args: [value],
  //   onSuccess: (data) => {
  //     form.setValue("amountOut", formatUnits(data, outputToken?.decimals || 18))
  //   },
  // })
}
