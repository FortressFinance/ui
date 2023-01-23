import { FC } from "react"

type AddressProps = {
  children: string | undefined
}

const Address: FC<AddressProps> = ({ children: address }) => {
  if (!address) return null
  return (
    <>
      {address.substring(0, 6)}...{address.substring(address.length - 4)}
    </>
  )
}

export default Address
