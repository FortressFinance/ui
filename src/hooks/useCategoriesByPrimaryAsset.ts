import { Address } from "wagmi"

import { FilterCategory } from "@/lib/types"
import { useActiveChainId } from "@/hooks"

const CATEGORIES_BY_PRIMARY_ASSET: Record<
  number,
  Record<Address, FilterCategory[]>
> = {
  // arbitrum
  42161: {
    "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf": ["featured", "crypto"],
  },
  // mainnet fork
  31337: {},
  // arbitrum fork
  313371: {
    "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf": ["featured", "crypto"],
    "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2": ["crypto"],
    "0x7f90122BF0700F9E7e1F688fe926940E8839F353": ["stable"],
  },
}

export function useCategoriesByPrimaryAsset() {
  const chainId = useActiveChainId()
  return CATEGORIES_BY_PRIMARY_ASSET[chainId] ?? {}
}
