import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getCompounderVaultsPreviewRedeem } from "@/lib/api/vaults/getCompounderVaultsPreviewRedeem"
import { queryKeys } from "@/lib/helpers"

export function useCurveYbTokenToAsset({
  chainId,
  id,
  token = "0x",
  amount,
  slippage,
  enabled,
}: {
  chainId: number
  id: number | undefined
  token: Address | undefined
  amount: string
  slippage: number
  enabled: boolean
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
