import { RadioGroup } from "@headlessui/react"
import * as Dialog from "@radix-ui/react-dialog"
import { FC, forwardRef, KeyboardEventHandler, MouseEventHandler } from "react"
import { UseControllerReturn } from "react-hook-form"
import { Address } from "wagmi"

import {
  AssetLogoWithUnderlyings,
  AssetName,
  AssetSymbol,
} from "@/components/Asset"
import { ModalBaseProps } from "@/components/Modal/lib/ModalBase"
import PurpleModal, {
  PurpleModalContent,
} from "@/components/Modal/lib/PurpleModal"
import { TokenFormValues } from "@/components/TokenForm/TokenForm"

import { FortIconCloseCircle } from "@/icons"

type TokenSelectModalProps = ModalBaseProps & {
  asset?: Address
  controller: UseControllerReturn<TokenFormValues, "inputToken" | "outputToken">
  tokenAddresses?: Address[] | readonly Address[]
  onChangeToken: () => void
}

const TokenSelectModal: FC<TokenSelectModalProps> = ({
  asset,
  controller: {
    field: { onChange: controllerOnChange, ...controllerField },
  },
  isOpen,
  tokenAddresses,
  onClose,
  onChangeToken,
}) => {
  const clickHandler: MouseEventHandler<HTMLDivElement> = () => onClose()
  const keyDownHandler: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") onClose()
  }

  const changeHandler = (...event: unknown[]) => {
    controllerOnChange(...event)
    onChangeToken()
  }

  return (
    <PurpleModal className="max-w-md" isOpen={isOpen} onClose={onClose}>
      <PurpleModalContent>
        <header className="mb-4 flex items-center justify-between">
          <Dialog.Title className="text-xl">Select a token</Dialog.Title>
          <Dialog.Close onClick={onClose} tabIndex={-1}>
            <FortIconCloseCircle className="h-7 w-7" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </header>

        <RadioGroup
          className="mt-3 space-y-1"
          onChange={changeHandler}
          {...controllerField}
        >
          {asset && (
            <TokenSelectOption
              tokenAddress={asset}
              onClick={clickHandler}
              onKeyDown={keyDownHandler}
            />
          )}

          {tokenAddresses?.map((tokenAddress, index) => (
            <TokenSelectOption
              key={`option-${index}`}
              tokenAddress={tokenAddress}
              onClick={clickHandler}
              onKeyDown={keyDownHandler}
            />
          ))}
        </RadioGroup>
      </PurpleModalContent>
    </PurpleModal>
  )
}

export default TokenSelectModal

type TokenSelectOptionProps = {
  tokenAddress: Address
  underlyigAssets?: Address[]
  onClick: MouseEventHandler<HTMLDivElement>
  onKeyDown: KeyboardEventHandler<HTMLDivElement>
}

const TokenSelectOption = forwardRef<HTMLDivElement, TokenSelectOptionProps>(
  ({ tokenAddress, underlyigAssets, onClick, onKeyDown }, ref) => {
    return (
      <RadioGroup.Option
        as="div"
        ref={ref}
        className="grid grid-cols-[auto,1fr] grid-rows-[1fr,auto] items-center gap-x-2 rounded-lg p-2 ui-checked:bg-white/80 ui-checked:text-pink-900 ui-not-checked:bg-black ui-not-checked:text-white ui-not-disabled:cursor-pointer ui-disabled:cursor-not-allowed ui-disabled:opacity-50 md:gap-x-3 md:p-3"
        value={tokenAddress}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        <div className="row-span-2 row-start-1">
          <AssetLogoWithUnderlyings
            className="h-9 w-9 drop-shadow md:h-10 md:w-10"
            tokenAddress={tokenAddress}
            underlyingAssets={underlyigAssets}
          />
        </div>
        <h2 className="col-start-2 row-start-1 font-medium">
          <AssetSymbol address={tokenAddress} />
        </h2>
        <h3 className="col-start-2 row-start-2 text-sm">
          <AssetName address={tokenAddress} />
        </h3>
      </RadioGroup.Option>
    )
  }
)
