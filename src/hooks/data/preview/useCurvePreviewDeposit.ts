import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getCompounderVaultsPreviewDeposit, PreviewData } from "@/lib/api/vaults/getCompounderVaultsPreviewDeposit"
import { queryKeys } from "@/lib/helpers"

export function useCurvePreviewDeposit({
  chainId,
  id,
  token = "0x",
  amount,
  slippage,
  enabled,
  onSuccess,
  onError
}: {
  chainId: number
  id: number | undefined
  token: Address | undefined,
  amount: string
  slippage: number
  enabled: boolean
  onSuccess: ((data: PreviewData) => void) | undefined
  onError: ((err: unknown) => void) | undefined
}) {

  return useQuery({
    ...queryKeys.vaults.previewDeposit({ chainId, isCurve:true, id, token, amount, slippage }),
    queryFn: () => getCompounderVaultsPreviewDeposit({chainId, isCurve:true, id, token, amount, slippage}),
    retry: false,
    enabled,
    onSuccess,
    onError
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