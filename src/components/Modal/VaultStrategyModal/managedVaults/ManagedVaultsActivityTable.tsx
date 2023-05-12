import { FC } from "react"
import { BsQuestionCircle } from "react-icons/bs"

import { shortenAddress } from "@/lib/helpers"
import { formatDate } from "@/lib/helpers/formatDate"

import Tooltip from "@/components/Tooltip"

export const ManagedVaultsActivityTable: FC = () => {
  return (
    <>
      <div className="relative items-center gap-x-2 overflow-hidden border-b border-pink-300 p-3 text-xs font-semibold uppercase text-pink-300 backdrop-blur-md lg:grid lg:grid-cols-[1fr,1fr,1fr] lg:px-6">
        <span>Timestamp</span>
        <span>Events</span>
        <span>Blockchain Explorer</span>
      </div>
      <ManagedVaultsActivityRow />
    </>
  )
}

const ManagedVaultsActivityRow: FC = () => {
  // Generate random data for 10 objects
  const activities = Array.from({ length: 10 }, () => ({
    timestamp: new Date(),
    events: "AddAssetVault",
    explorer: "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a",
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results: any = []
  activities.forEach((activity) => {
    results.push(
      <div className="items-center gap-x-2 border-b border-pink-300 p-3 text-sm font-normal text-pink-200 lg:grid lg:grid-cols-[1fr,1fr,1fr] lg:px-6">
        <span>{formatDate(activity.timestamp, "medium", "short")}</span>
        <span>
          <Tooltip label="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu cursus lorem, et viverra mi. Cras ornare, ante in fringilla dignissim, ligula lectus finibus libero, in volutpat erat ipsum ut felis.">
            <span>
              <div className="float-left mr-1">{activity.events}</div>
              <BsQuestionCircle className="float-left mt-[2px] h-4 w-4 cursor-pointer" />
            </span>
          </Tooltip>
        </span>
        <span>{shortenAddress(activity.explorer)}</span>
      </div>
    )
  })
  return <div className="max-h-[350px] w-full overflow-y-scroll">{results}</div>
}
