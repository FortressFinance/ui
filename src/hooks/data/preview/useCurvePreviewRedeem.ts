import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getCompounderVaultsPreviewRedeem, PreviewData } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"

export function useCurvePreviewRedeem({
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
      isCurve: true,
      id,
      token,
      amount,
      slippage,
    }),
    queryFn: () =>
      getCompounderVaultsPreviewRedeem({
        chainId,
        isCurve: true,
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
  //   address: vaultAddress,
  //   abi: vaultCompounderAbi,
  //   functionName: "previewRedeem",
  //   args: [value],
  //   onSuccess: (data) => {
  //     form.setValue("amountOut", formatUnits(data, outputToken?.decimals || 18))
  //   },
  // })
}
