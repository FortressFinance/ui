import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { PreviewData } from "@/lib/api/vaults/getCompounderVaultsPreviewDeposit"
import { getCompounderVaultsPreviewRedeem } from "@/lib/api/vaults/getCompounderVaultsPreviewRedeem"
import { queryKeys } from "@/lib/helpers"

export function useBalancerPreviewRedeem({
  chainId,
  id,
  token = "0x",
  amount,
  slippage,
  enabled,
  onSuccess,
  onError,
}: {
  chainId: number
  id: number | undefined
  token: Address | undefined
  amount: string
  slippage: number
  enabled: boolean
  onSuccess: ((data: PreviewData) => void) | undefined
  onError: ((err: unknown) => void) | undefined
}) {
  return useQuery({
    ...queryKeys.vaults.previewRedeem({
      chainId,
      isCurve: false,
      id,
      token,
      amount,
      slippage,
    }),
    queryFn: () =>
      getCompounderVaultsPreviewRedeem({
        chainId,
        isCurve: false,
        id,
        token,
        amount,
        slippage,
      }),
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
