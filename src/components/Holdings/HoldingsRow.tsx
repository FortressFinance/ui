import { BigNumber } from "ethers"
import { FC } from "react"
import { useAccount } from "wagmi"

import { useCompounderVault } from "@/hooks/data/compounders"
import useTokenOrNativeBalance from "@/hooks/useTokenOrNativeBalance"

import VaultRow from "@/components/Vault/VaultRow"

import { YieldVaultRowProps } from "@/pages/app/yield"

export const HoldingsRow: FC<YieldVaultRowProps> = (props) => {
  const vaultAddress = useCompounderVault(props)
  const { isConnected } = useAccount()
  const { data: balance, isLoading } = useTokenOrNativeBalance({ address: vaultAddress.data })
  const formatedBalance = BigNumber.from(balance?.formatted?? 0)
  
  return !isConnected || isLoading || formatedBalance.eq(BigNumber.from(0))
  ? null 
  : <VaultRow {...props} vaultAddress={vaultAddress.data} />
}
