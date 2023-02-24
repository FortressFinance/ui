import { FC, MouseEventHandler } from "react"
import { useAccount } from "wagmi"

import { useClientReady } from "@/hooks/util"

import Address from "@/components/Address"
import Button, { ButtonProps } from "@/components/Button"

import { useConnectWallet } from "@/store/connectWallet"

type ConnectWalletButtonProps = Pick<ButtonProps, "size"> & {
  className?: string
}

const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  className,
  ...buttonProps
}) => {
  const isReady = useClientReady()
  const { address, isConnected } = useAccount()
  const setConnectModal = useConnectWallet((state) => state.setConnectModal)

  const clickHandler: MouseEventHandler<HTMLButtonElement> = () => {
    setConnectModal(isConnected ? "connected" : "disconnected")
  }

  return (
    <Button className={className} onClick={clickHandler} {...buttonProps}>
      {isReady && isConnected ? (
        <Address>{address}</Address>
      ) : (
        <>Connect Wallet</>
      )}
    </Button>
  )
}

export default ConnectWalletButton
