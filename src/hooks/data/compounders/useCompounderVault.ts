import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import useRegistryContract from "@/hooks/useRegistryContract"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"
import { useFallbackRead } from "@/hooks/util"

export function useCompounderVault({ asset, type }: VaultProps) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiCompounder = useApiCompounderVaultAddress({ asset, type })
  const apiTokenCompounder = useApiTokenCompounderVaultAddress({ asset, type })

  // Fallback: contract requests
  const fallbackRequest = useFallbackRead(
    {
      ...useRegistryContract(),
      functionName: isToken
        ? "getTokenCompounder"
        : isCurve
        ? "getCurveCompounder"
        : "getBalancerCompounder",
      args: [asset ?? "0x"],
      enabled: !!asset,
    },
    [apiCompounder, apiTokenCompounder]
  )

  return apiCompounder.isEnabled && !apiCompounder.isError
    ? apiCompounder
    : apiTokenCompounder.isEnabled && !apiTokenCompounder.isError
    ? apiTokenCompounder
    : fallbackRequest
}

function useApiCompounderVaultAddress({ asset, type }: VaultProps) {
  const compounderVaults = useApiCompounderVaults({ type })
  const matchedVault = findApiCompounderVaultForAsset(
    compounderVaults.data,
    asset
  )
  return {
    ...compounderVaults,
    data: matchedVault?.token.ybToken.address,
  }
}

function useApiTokenCompounderVaultAddress({ asset, type }: VaultProps) {
  const tokenVaults = useApiTokenVaults({ type })
  const matchedVault = findApiTokenVaultForAsset(tokenVaults.data, asset)
  return {
    ...tokenVaults,
    data: matchedVault?.token.ybToken.address,
  }
}
