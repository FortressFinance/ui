import { FC } from "react"
import { Address } from "wagmi"

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
    <>
      {address.substring(0, 6)}...{address.substring(address.length - 4)}
    </>
  ) : null
}

export default Address
