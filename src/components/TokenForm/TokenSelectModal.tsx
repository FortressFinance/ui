import { Dialog, RadioGroup } from "@headlessui/react"
import { FC, Fragment, KeyboardEventHandler, MouseEventHandler } from "react"
import { UseControllerReturn } from "react-hook-form"
import { Address } from "wagmi"

import clsxm from "@/lib/clsxm"
import useTokensOrNative from "@/hooks/useTokensOrNative"

import AssetLogo from "@/components/AssetLogo"
import { ModalBaseProps } from "@/components/Modal/ModalBase"
import PurpleModal, { PurpleModalContent } from "@/components/Modal/PurpleModal"
import { TokenFormValues } from "@/components/TokenForm/TokenForm"

import Close from "~/svg/icons/close.svg"

type TokenSelectModalProps = ModalBaseProps & {
  controller: UseControllerReturn<TokenFormValues, "inputToken" | "outputToken">
  tokenAddresses: Address[] | readonly Address[] | undefined
}

const TokenSelectModal: FC<TokenSelectModalProps> = ({
  controller,
  isOpen,
  onClose,
  tokenAddresses,
}) => {
  const { data: tokens } = useTokensOrNative({ addresses: tokenAddresses })

  const clickHandler: MouseEventHandler<HTMLDivElement> = () => {
    onClose()
  }

  const keyHandler: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") onClose()
  }

  return (
    <PurpleModal className="max-w-md" isOpen={isOpen} onClose={onClose}>
      <PurpleModalContent>
        <header className="flex items-center justify-between">
          <Dialog.Title as="h1">Select a token</Dialog.Title>
          <button className="h-6 w-6" onClick={onClose} tabIndex={-1}>
            <Close className="h-6 w-6" aria-label="Close" />
          </button>
        </header>

        <RadioGroup className="mt-3 space-y-1" {...controller.field}>
          {tokens?.map((token, index) => (
            <RadioGroup.Option
              as={Fragment}
              key={`token-${index}`}
              value={token.address}
            >
              {({ checked, disabled }) => (
                <div
                  ref={controller.field.ref}
                  className={clsxm(
                    "grid grid-cols-[auto,1fr] grid-rows-[1fr,auto] items-center gap-x-2 rounded-md p-2",
                    {
                      "bg-white/80 text-black": checked,
                      "bg-black text-white": !checked,
                      "opacity-50": disabled,
                      "cursor-pointer": !disabled,
                    }
                  )}
                  onClick={clickHandler}
                  onKeyDown={keyHandler}
                >
                  <AssetLogo
                    className="col-start-1 row-span-2 row-start-1 h-7 w-7"
                    name="curve"
                  />
                  <h2 className="col-start-2 row-start-1 text-sm">
                    {token.symbol}
                  </h2>
                  <h3 className="col-start-2 row-start-2 text-xs">
                    {token.name}
                  </h3>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </PurpleModalContent>
    </PurpleModal>
  )
}

export default TokenSelectModal
