import * as Tabs from "@radix-ui/react-tabs"
import { FC } from "react"

import { ManagedVaultsActivityTable } from "@/components/Modal/VaultStrategyModal/managedVaults/ManagedVaultsActivityTable"

export const ManagedVaultsLeftPanel: FC = () => {
  const strategyTextValue = undefined
  return (
    <div className="max-md:row-start-2">
      <Tabs.Root className="flex w-full flex-col" defaultValue="tabDescription">
        <Tabs.List
          className="flex shrink-0 border-b border-pink-800"
          aria-label="Vault description"
        >
          <Tabs.Trigger
            className="flex h-[41px] p-3 text-xs font-semibold uppercase text-pink-300 ui-state-active:border-b ui-state-active:border-pink-300 max-md:border-t max-md:text-center md:px-5"
            value="tabDescription"
          >
            Vault description
          </Tabs.Trigger>
          <Tabs.Trigger
            className="flex h-[41px] p-3 text-xs font-semibold uppercase text-pink-300 ui-state-active:border-b ui-state-active:border-pink-300 max-md:border-t max-md:text-center md:px-5"
            value="tabActivity"
          >
            Activity
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          className="space-y-3 p-4 pb-5 leading-relaxed text-pink-50 max-md:text-sm md:px-5"
          value="tabDescription"
        >
          {strategyTextValue ?? "No description available"}
        </Tabs.Content>
        <Tabs.Content
          className="space-y-3 py-4 pb-5 leading-relaxed text-pink-50 max-md:text-sm"
          value="tabActivity"
        >
          <ManagedVaultsActivityTable />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
