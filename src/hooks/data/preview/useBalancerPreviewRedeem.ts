import { useQuery } from "@tanstack/react-query"

import { getCompounderVaultsPreviewRedeem } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { PreviewVaultSpecificTransactionArgs } from "@/hooks/data/preview/types"

export function useBalancerPreviewRedeem({
  enabled,
  onError,
  onSuccess,
  ...args
}: PreviewVaultSpecificTransactionArgs) {
  return useQuery({
    ...queryKeys.vaults.previewRedeem(args),
    queryFn: () =>
      getCompounderVaultsPreviewRedeem({ ...args, isCurve: false }),
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
