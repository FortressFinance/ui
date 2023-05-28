import { FC } from "react"

import Skeleton from "@/components/Skeleton"
import { VaultManager } from "@/components/VaultRow/lib"

export const ManagedVaultsStrategyModalManager: FC = () => {
  return (
    <Skeleton isLoading={false} className="block w-full">
      <dl className="flex h-auto flex-none flex-row items-start gap-1 self-stretch px-0 pb-2 pt-0 text-sm text-pink-100">
        <dt className="w-1/2">Vault Manager :</dt>
        <dd className="w-1/2 text-right">
          <VaultManager />
        </dd>
      </dl>
    </Skeleton>
  )
}
