import { Menu } from "@headlessui/react"
import { Dispatch, FC, SetStateAction } from "react"

import { ConcentratorTargetAsset } from "@/lib/types"
import { useConcentratorTargetAssets } from "@/hooks/data/concentrators/useConcentratorTargetAssets"
import { useClientReady } from "@/hooks/util/useClientReady"

import { DropdownMenu } from "@/components/DropdownMenu"
import Skeleton from "@/components/Skeleton"
import { TabButton } from "@/components/Tabs"

import ChevronDown from "~/svg/icons/chevron-down.svg"

type ConcentratorMenuProps = {
  concentratorTargetAsset: ConcentratorTargetAsset | undefined
  setConcentratorTargetAsset: Dispatch<SetStateAction<ConcentratorTargetAsset>>
}

export const ConcentratorMenu: FC<ConcentratorMenuProps> = ({
  concentratorTargetAsset,
  setConcentratorTargetAsset,
}) => {
  const clientReady = useClientReady()
  const concentratorTargetAssets = useConcentratorTargetAssets({
    onSuccess: (data) => {
      if (!concentratorTargetAsset && data?.length)
        setConcentratorTargetAsset(data[0])
    },
  })

  // TODO: This isn't the best solution. We must handle cases where no assets exist or failure
  const isLoading =
    !clientReady ||
    !concentratorTargetAsset ||
    concentratorTargetAssets.isLoading

  return (
    <Menu as={DropdownMenu}>
      <Menu.Button
        as={TabButton}
        className="group flex w-full items-center gap-3 rounded-md border-2 border-pink/30 bg-black/60 text-white hover:bg-pink-900 hover:text-orange-400 focus-visible:bg-pink-900 focus-visible:text-orange-400 ui-open:rounded-b-none ui-open:border-b-0 ui-open:bg-pink-900 md:px-4"
        disabled={isLoading}
      >
        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-left">
          <Skeleton isLoading={isLoading}>
            {clientReady && concentratorTargetAsset
              ? `${concentratorTargetAsset}`
              : "Loading concentrator..."}
          </Skeleton>
        </div>
        <ChevronDown className="w-3 shrink-0 stroke-white group-hover:stroke-orange-400 group-focus-visible:stroke-orange-400" />
      </Menu.Button>
      <Menu.Items className="divide-y divide-pink-700 overflow-hidden rounded-b-md border-l-2 border-r-2 border-b-2 border-pink/30 bg-pink-900 focus-visible:outline-none">
        {clientReady &&
          concentratorTargetAssets.data?.map((targetAsset, index) => (
            <Menu.Item
              as="button"
              key={`concentrator-menu-item-${index}`}
              className="block w-full overflow-hidden text-ellipsis whitespace-nowrap px-4 py-3 text-left hover:text-orange-400 ui-active:text-orange-400"
              onClick={() => setConcentratorTargetAsset(targetAsset)}
            >
              {targetAsset}
            </Menu.Item>
          ))}
      </Menu.Items>
    </Menu>
  )
}
