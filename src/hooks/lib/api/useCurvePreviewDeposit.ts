import { useQuery } from "@tanstack/react-query"

import { getCompounderVaultsPreviewDeposit } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { PreviewVaultSpecificTransactionArgs } from "@/hooks/lib/api/types"

export function useCurvePreviewDeposit({
  enabled,
  onError,
  onSuccess,
  ...args
}: PreviewVaultSpecificTransactionArgs) {
  return useQuery({
    ...queryKeys.vaults.previewDeposit(args),
    queryFn: () =>
      getCompounderVaultsPreviewDeposit({ ...args, isCurve: true }),
    retry: false,
    enabled,
    onSuccess,
    onError,
  })

  // Preview deposit method
  // const { isLoading: isLoadingPreview } = useContractRead({
  //   chainId,
  //   abi: vaultCompounderAbi,
  //   address: vaultAddress,
  //   functionName: "previewDeposit",
  //   args: [value],
  //   onSuccess: (data) => {
  //     form.setValue("amountOut", formatUnits(data, ybToken?.decimals || 18))
  //   },
  // })
}
