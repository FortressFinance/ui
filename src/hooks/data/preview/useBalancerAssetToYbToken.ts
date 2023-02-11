import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getCompounderVaultsPreviewDeposit } from "@/lib/api/vaults/getCompounderVaultsPreviewDeposit"
import { queryKeys } from "@/lib/helpers"

export function useBalancerAssetToYbToken({
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
    ...queryKeys.vaults.previewDeposit({
      chainId,
      isCurve: false,
      id,
      token,
      amount,
      slippage,
    }),
    queryFn: () =>
      getCompounderVaultsPreviewDeposit({
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
