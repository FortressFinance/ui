import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useActiveChainId } from "@/hooks"

const CONCENTRATOR_VAULT_TYPE_BY_ASSET: Record<
  number,
  Record<Address, VaultType>
> = {
  // arbitrum
  42161: {
    "0x86eE39B28A7fDea01b53773AEE148884Db311B46": "token",
    "0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5": "curve",
    "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2": "curve",
  },
  // mainnet fork
  31337: {},
  // arbitrum fork
  313371: {
    "0xBDF9001c5d3fFc03AB6564CA28E530665594dfF7": "token",
    "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2": "curve",
  },
}

export function useConcentratorVaultTypeByAsset() {
  const chainId = useActiveChainId()
  return CONCENTRATOR_VAULT_TYPE_BY_ASSET[chainId] ?? {}
}
