import { FC } from "react"
import { HiLockClosed, HiLockOpen } from "react-icons/hi"

import Skeleton from "@/components/Skeleton"
import { GradientText } from "@/components/Typography"
import { VaultEpoch } from "@/components/VaultRow/lib"

export const ManagedVaultsStrategyModalEpoch: FC = () => {
  const epochRunning = true

  return (
    <Skeleton isLoading={false} className="block w-full">
      <div className="justify-left flex h-8 flex-none flex-row items-center gap-1 px-0 pb-2 pt-0 text-xs">
        {epochRunning ? (
          <>
            <GradientText>Closed</GradientText>
            <HiLockClosed className="flex h-3 w-3 cursor-pointer text-pink-500" />
          </>
        ) : (
          <>
            <GradientText>Open</GradientText>
            <HiLockOpen className="flex h-3 w-3 cursor-pointer text-pink-500" />
          </>
        )}
      </div>
      <div className="flex h-8 h-auto flex-none flex-row items-start gap-1 self-stretch px-0 pb-2 pt-0 text-sm text-pink-100">
        <div className="w-1/2">Epoch duration :</div>
        <div className="w-1/2 text-right">
          <VaultEpoch />
        </div>
      </div>
      <div className="flex h-8 flex-none flex-row items-start gap-1 self-stretch px-0 pb-2 pt-0 text-sm text-pink-100">
        <div className="w-1/2">Epoch number :</div>
        <div className="w-1/2 text-right">20</div>
      </div>
    </Skeleton>
  )
}
