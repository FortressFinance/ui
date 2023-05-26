import { FC } from "react"
import { HiLockClosed, HiLockOpen } from "react-icons/hi"

import { VaultName } from "@/components/VaultRow/lib"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

export const ManagedVaultsNameCell: FC<VaultRowPropsWithProduct> = (props) => {
  const epochRunning = true
  return (
    <span className="line-clamp-2 max-lg:mr-8">
      <VaultName {...props} />
      {epochRunning ? (
        <HiLockClosed className="float-left ml-2 mt-0.5 h-5 w-5 cursor-pointer" />
      ) : (
        <HiLockOpen className="float-left ml-2 mt-0.5 h-5 w-5 cursor-pointer" />
      )}
    </span>
  )
}
