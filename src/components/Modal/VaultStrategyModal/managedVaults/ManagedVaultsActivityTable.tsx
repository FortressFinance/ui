import { FC } from "react"
import { BsQuestionCircle } from "react-icons/bs"

import { shortenAddress } from "@/lib/helpers"
import { formatDate } from "@/lib/helpers/formatDate"

import Tooltip from "@/components/Tooltip"

export const ManagedVaultsActivityTable: FC = () => {
  return (
    <>
      <div className="relative grid grid-cols-[1fr,1fr,1fr] items-center overflow-hidden border-b border-pink-800 p-3 text-center text-xs font-semibold uppercase text-pink-300 backdrop-blur-md max-md:grid-cols-[auto,130px,80px] max-md:gap-x-1 lg:gap-x-2 lg:px-6">
        <span>Timestamp</span>
        <span>Events</span>
        <span className="max-md:hidden">Blockchain Explorer</span>
        <span className="lg:hidden">Explorer</span>
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

  return (
    <div className="max-h-[350px] w-full overflow-y-scroll">
      {activities.map((activity, index) => (
        <div
          key={`activity-${index}`}
          className="grid grid-cols-[1fr,1fr,1fr] items-center border-b border-pink-800 p-3 text-sm font-normal text-pink-200 max-md:grid-cols-[auto,130px,80px] max-md:gap-x-1 lg:gap-x-2 lg:px-6"
        >
          <span className="max-md:hidden">
            {formatDate(activity.timestamp, "medium", "short")}
          </span>
          <span className="lg:hidden">
            {formatDate(activity.timestamp, "short", "short")}
          </span>
          <span>
            <Tooltip label="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu cursus lorem, et viverra mi. Cras ornare, ante in fringilla dignissim, ligula lectus finibus libero, in volutpat erat ipsum ut felis.">
              <span>
                <div className="float-left mr-1 text-center">
                  {activity.events}
                </div>
                <BsQuestionCircle className="float-left mt-[2px] h-4 w-4 cursor-pointer" />
              </span>
            </Tooltip>
          </span>
          <span className="max-md:hidden">
            {shortenAddress(activity.explorer)}
          </span>
          <span className="lg:hidden">
            {shortenAddress(activity.explorer, 2)}
          </span>
        </div>
      ))}
    </div>
  )
}
