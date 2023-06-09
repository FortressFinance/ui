import Link from "next/link"
import { FC } from "react"
import { Address } from "wagmi"

import clsxm from "@/lib/clsxm"
import { enabledNetworks } from "@/lib/wagmi"

import Tooltip from "@/components/Tooltip"

import { FortIconExternalLink } from "@/icons"

type ViewContractOnExplorerProps = {
  chainId: number
  className?: string
  contractAddress?: Address
}

export const ViewContractOnExplorer: FC<ViewContractOnExplorerProps> = ({
  chainId,
  className,
  contractAddress,
}) => {
  const chain = enabledNetworks.chains.find((c) => c.id === chainId)
  return (
    <Tooltip
      label={`View contract on ${
        chain?.blockExplorers?.default.name ?? "block explorer"
      }`}
    >
      <Link
        // This icon appears just slightly larger than other icons, so add a little padding to make it look more consistent
        className={clsxm("p-px", className)}
        href={`${chain?.blockExplorers?.default.url}/address/${contractAddress}#code`}
        target="_blank"
      >
        <FortIconExternalLink className="h-full w-full stroke-current" />
        <span className="sr-only">
          View contract on{" "}
          {chain?.blockExplorers?.default.name ?? "block explorer"}
        </span>
      </Link>
    </Tooltip>
  )
}
