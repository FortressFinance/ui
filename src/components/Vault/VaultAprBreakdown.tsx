import { FC, Fragment } from "react"
import { BiInfoCircle } from "react-icons/bi"

import { trpc } from "@/lib/trpc"
import { VaultProps } from "@/lib/types"
import { useVaultPoolId } from "@/hooks/data/vaults"
import useActiveChainId from "@/hooks/useActiveChainId"

import Percentage from "@/components/Percentage"
import Skeleton from "@/components/Skeleton"
import Tooltip from "@/components/Tooltip"
import { GradientText } from "@/components/Typography"

const aprKeyToLabel: Record<string, string> = {
  baseApr: "Base APR",
  crvApr: "CRV APR",
  cvxApr: "CVX APR",
  extraRewardsApr: "Extra Rewards APR",
  BALApr: "BAL APR",
  AuraApr: "AURA APR",
  GMXApr: "GMX APR",
  ETHApr: "ETH APR",
  totalApr: "Total APR",
}

export const VaultAprBreakdown: FC<Required<VaultProps>> = (props) => {
  const poolId = useVaultPoolId(props)
  const chainId = useActiveChainId()
  const vaultApr = trpc.vaultApr.useQuery(
    { id: poolId.data ?? 0, chainId, ...props },
    { enabled: poolId.data !== undefined }
  )
  const visibleLineItems = Object.entries(vaultApr.data?.apr ?? {}).filter(
    ([_aprKey, aprValue]) => !!aprValue
  )

  return (
    <>
      <dt className="flex items-center gap-1 text-base font-bold">
        <GradientText>Total APY</GradientText>
        <Tooltip label="APY calculation assumes weekly compounding and excludes Fortress fees">
          <span>
            <BiInfoCircle className="h-5 w-5 cursor-pointer" />
          </span>
        </Tooltip>
      </dt>
      <dd className="text-right text-base font-bold">
        <GradientText>
          <Skeleton isLoading={poolId.isLoading || vaultApr.isLoading}>
            <Percentage>{vaultApr.data?.apy ?? 0}</Percentage>
          </Skeleton>
        </GradientText>
      </dd>
      {visibleLineItems.map(([aprKey, aprValue]) => (
        <Fragment key={aprKey}>
          <dt>{aprKeyToLabel[aprKey]}</dt>
          <dd className="text-right">
            <Percentage>{aprValue}</Percentage>
          </dd>
        </Fragment>
      ))}
    </>
  )
}
