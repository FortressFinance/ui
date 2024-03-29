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
    "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2": ["featured", "crypto"],
    "0x7f90122BF0700F9E7e1F688fe926940E8839F353": ["featured", "stable"],
    "0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5": ["featured", "stable"],
  },
  // mainnet fork
  31337: {},
  // arbitrum fork
  313371: {
    "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf": ["featured", "crypto"],
    "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2": ["featured", "crypto"],
    "0x7f90122BF0700F9E7e1F688fe926940E8839F353": ["featured", "stable"],
    "0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5": ["featured", "stable"],
  },
  // localhost
  1337: {
    "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf": ["featured", "crypto"],
    "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2": ["featured", "crypto"],
    "0x7f90122BF0700F9E7e1F688fe926940E8839F353": ["featured", "stable"],
    "0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5": ["featured", "stable"],
  },
}

export function useCategoriesByPrimaryAsset() {
  const chainId = useActiveChainId()
  return CATEGORIES_BY_PRIMARY_ASSET[chainId] ?? {}
}
