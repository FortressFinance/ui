import { Dialog, RadioGroup } from "@headlessui/react"
import { FC, Fragment, KeyboardEventHandler, MouseEventHandler } from "react"
import { UseControllerReturn } from "react-hook-form"
import { Address } from "wagmi"

import clsxm from "@/lib/clsxm"
import { VaultType } from "@/lib/types"
import useTokensOrNative from "@/hooks/useTokensOrNative"

import { AssetLogoWithUnderlyings } from "@/components/Asset"
import { ModalBaseProps } from "@/components/Modal/ModalBase"
import PurpleModal, { PurpleModalContent } from "@/components/Modal/PurpleModal"
import { TokenFormValues } from "@/components/TokenForm/TokenForm"

import { FortIconCloseCircle } from "@/icons"

type TokenSelectModalProps = ModalBaseProps & {
  controller: UseControllerReturn<TokenFormValues, "inputToken" | "outputToken">
  tokenAddresses: Address[] | readonly Address[] | undefined
  lpToken: Address | undefined
  vaultType: VaultType
}

const TokenSelectModal: FC<TokenSelectModalProps> = ({
  controller,
  isOpen,
  onClose,
  tokenAddresses,
  lpToken,
  vaultType,
}) => {
  const { data: tokens } = useTokensOrNative({
    tokenAddresses: tokenAddresses,
    lpToken,
  })

  const clickHandler: MouseEventHandler<HTMLDivElement> = () => {
    onClose()
  }

  const keyHandler: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") onClose()
  }
  return (
    <PurpleModal className="max-w-md" isOpen={isOpen} onClose={onClose}>
      <PurpleModalContent>
        <header className="mb-4 flex items-center justify-between">
          <Dialog.Title as="h1" className="text-xl">
            Select a token
          </Dialog.Title>
          <button onClick={onClose} tabIndex={-1}>
            <FortIconCloseCircle className="h-7 w-7" />
            <span className="sr-only">Close</span>
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
                    "grid grid-cols-[auto,1fr] grid-rows-[1fr,auto] items-center gap-x-2 rounded-lg p-2 md:gap-x-3 md:p-3",
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
                  <div className="row-span-2 row-start-1">
                    <AssetLogoWithUnderlyings
                      className="h-9 w-9 drop-shadow md:h-10 md:w-10"
                      name={vaultType}
                      tokenAddress={token.address}
                      underlyingAssets={
                        token.isLpToken ? tokenAddresses : undefined
                      }
                    />
                  </div>
                  <h2 className="col-start-2 row-start-1 font-medium">
                    {token.symbol}
                  </h2>
                  <h3 className="col-start-2 row-start-2 text-sm">
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
