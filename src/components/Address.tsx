import { FC } from "react"
import { Address } from "wagmi"

import { shortenAddress } from "@/lib/helpers"
import { useMainnetEnsName } from "@/hooks"

type AddressProps = {
  children: string | undefined
}

const Address: FC<AddressProps> = ({ children: address }) => {
  const { data: ensName } = useMainnetEnsName({
    address: (address ?? "0x") as Address,
  })

  return ensName ? (
    <>{ensName}</>
  ) : address ? (
    <>{shortenAddress(address)}</>
  ) : null
}

export default Address
