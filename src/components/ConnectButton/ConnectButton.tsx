import { FC } from "react"
import { useAccount } from "wagmi"

import { useClientReady } from "@/hooks"

import Address from "@/components/Address"
import Button, { ButtonProps } from "@/components/Button"

import { useGlobalStore } from "@/store"

type ConnectButtonProps = Pick<ButtonProps, "size"> & {
  className?: string
}

export const ConnectButton: FC<ConnectButtonProps> = ({
  className,
  ...buttonProps
}) => {
  const isReady = useClientReady()
  const { address, isConnected } = useAccount()

  const setActiveModal = useGlobalStore((store) => store.setActiveModal)

  return (
    <Button
      className={className}
      onClick={() => setActiveModal(isConnected ? "account" : "connect")}
      {...buttonProps}
    >
      {isReady && isConnected ? (
        <Address>{address}</Address>
      ) : (
        <>Connect Wallet</>
      )}
    </Button>
  )
}
