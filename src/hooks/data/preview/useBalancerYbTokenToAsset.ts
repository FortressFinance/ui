import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getCompounderVaultsPreviewRedeem } from "@/lib/api/vaults/getCompounderVaultsPreviewRedeem"
import { queryKeys } from "@/lib/helpers"

export function useBalancerYbTokenToAsset({
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
