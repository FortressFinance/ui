import { Menu } from "@headlessui/react"
import { Dispatch, FC, SetStateAction } from "react"
import { Address } from "wagmi"

import { useConcentratorTargetAssets } from "@/hooks/data/concentrators/useConcentratorTargetAssets"
import { useClientReady } from "@/hooks/util/useClientReady"

import { AssetSymbol } from "@/components/Asset"
import { DropdownMenu } from "@/components/DropdownMenu"
import { TabButton } from "@/components/Tabs"

import ChevronDown from "~/svg/icons/chevron-down.svg"

type ConcentratorMenuProps = {
  concentratorTargetAsset: Address | undefined
  setConcentratorTargetAsset: Dispatch<SetStateAction<Address>>
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
        className="pink-900 group flex w-full items-center gap-3 rounded-md border border-pink/30 bg-pink-900/80 text-white backdrop-blur-md focus-visible:bg-white focus-visible:text-pink-900 ui-open:rounded-b-none ui-open:border-b-0 ui-open:bg-pink-900 ui-open:hover:bg-pink-900 ui-open:hover:text-white ui-not-open:hover:text-pink-900 md:px-4"
        disabled={isLoading}
      >
        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-left">
          <AssetSymbol assetAddress={concentratorTargetAsset} />
        </div>
        <ChevronDown className="w-3 shrink-0 stroke-white group-focus-visible:stroke-pink-900 ui-open:rotate-180 ui-not-open:group-hover:stroke-pink-900" />
      </Menu.Button>
      <Menu.Items className="divide-y divide-pink/30 overflow-hidden rounded-b-md border-l border-r border-b border-pink/30 bg-pink-900/80 backdrop-blur-md focus-visible:outline-none">
        {clientReady &&
          concentratorTargetAssets.data?.map((targetAsset, index) => (
            <Menu.Item
              as="button"
              key={`concentrator-menu-item-${index}`}
              className="block w-full overflow-hidden text-ellipsis whitespace-nowrap px-4 py-3 text-left ui-active:bg-white ui-active:text-pink-900"
              onClick={() => setConcentratorTargetAsset(targetAsset)}
            >
              <AssetSymbol assetAddress={targetAsset} />
            </Menu.Item>
          ))}
      </Menu.Items>
    </Menu>
  )
}
