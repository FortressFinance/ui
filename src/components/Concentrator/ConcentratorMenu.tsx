import * as Collapsible from "@radix-ui/react-collapsible"
import { Dispatch, FC, SetStateAction, useEffect } from "react"
import { Address } from "wagmi"

import { useClientReady, useConcentratorTargetAssets } from "@/hooks"

import { AssetSymbol } from "@/components/Asset"
import { TabButton } from "@/components/Tabs"

import { FortIconChevronDown } from "@/icons"

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
      if (concentratorTargetAsset === "0x" && data?.length) {
        setConcentratorTargetAsset(data[0])
      }
    },
  })

  useEffect(() => {
    if (
      clientReady &&
      concentratorTargetAsset === "0x" &&
      concentratorTargetAssets.data?.length
    ) {
      setConcentratorTargetAsset(concentratorTargetAssets.data[0])
    }
  }, [
    clientReady,
    concentratorTargetAsset,
    concentratorTargetAssets.data,
    setConcentratorTargetAsset,
  ])

  // TODO: This isn't the best solution. We must handle cases where no assets exist or failure
  const isLoading =
    !clientReady ||
    !concentratorTargetAsset ||
    concentratorTargetAssets.isLoading

  return (
    <Collapsible.Root>
      <Collapsible.Trigger asChild>
        <TabButton
          className="pink-900 group flex w-full items-center gap-3 rounded-lg border border-pink/30 bg-pink-900/80 text-white backdrop-blur-md focus-visible:bg-white focus-visible:text-pink-900 ui-state-closed:hover:text-pink-900 ui-state-open:rounded-b-none ui-state-open:bg-pink-900 ui-state-open:hover:bg-pink-900 ui-state-open:hover:text-white md:px-4"
          disabled={isLoading}
        >
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-left">
            <AssetSymbol address={concentratorTargetAsset} />
          </div>
          <FortIconChevronDown className="w-3.5 shrink-0 stroke-current group-ui-state-open:rotate-180" />
        </TabButton>
      </Collapsible.Trigger>
      <Collapsible.Content asChild>
        <div className="divide-y divide-pink-700 overflow-hidden rounded-md border border-pink-800 bg-pink-900/80 backdrop-blur-md first-of-type:rounded-t-none focus-visible:outline-none">
          {concentratorTargetAssets.data?.map((targetAsset, index) => (
            <Collapsible.Trigger
              key={`concentrator-menu-item-${index}`}
              asChild
            >
              <button
                className="block w-full overflow-hidden text-ellipsis whitespace-nowrap px-4 py-3 text-left focus:outline-none focus-visible:bg-white focus-visible:text-pink-900"
                onClick={() => setConcentratorTargetAsset(targetAsset)}
              >
                {" "}
                <AssetSymbol address={targetAsset} />
              </button>
            </Collapsible.Trigger>
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
