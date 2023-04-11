import * as Dialog from "@radix-ui/react-dialog"
import * as RadioGroup from "@radix-ui/react-radio-group"
import { FC, forwardRef } from "react"
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
  return (
    <PurpleModal className="max-w-md" isOpen={isOpen} onClose={onClose}>
      <PurpleModalContent>
        <header className="mb-4 flex items-center justify-between">
          <Dialog.Title className="text-xl">Select a token</Dialog.Title>
          <Dialog.Close>
            <FortIconCloseCircle className="h-7 w-7" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </header>

        <RadioGroup.Root
          className="mt-3 space-y-1"
          onValueChange={(value) => {
            controllerOnChange(value)
            onChangeToken()
          }}
          orientation="vertical"
          {...controllerField}
        >
          {asset && (
            <TokenSelectOption tokenAddress={asset} onClose={onClose} />
          )}
          {tokenAddresses?.map((tokenAddress, index) => (
            <TokenSelectOption
              key={`option-${index}`}
              tokenAddress={tokenAddress}
              onClose={onClose}
            />
          ))}
        </RadioGroup.Root>
      </PurpleModalContent>
    </PurpleModal>
  )
}

export default TokenSelectModal

type TokenSelectOptionProps = {
  tokenAddress: Address
  underlyingAssets?: Address[]
  onClose: () => void
}

const TokenSelectOption = forwardRef<HTMLButtonElement, TokenSelectOptionProps>(
  ({ tokenAddress, underlyingAssets, onClose }, ref) => {
    return (
      <RadioGroup.Item ref={ref} value={tokenAddress} asChild>
        <button
          className="grid w-full grid-cols-[auto,1fr] grid-rows-[1fr,auto] items-center gap-x-2 rounded-lg p-2 ui-state-checked:bg-white/80 ui-state-checked:text-pink-900 ui-state-unchecked:bg-black ui-state-unchecked:text-white md:gap-x-3 md:p-3"
          onClick={(e) => {
            // radix-ui uses click events to move focus throughout the radio group for accessibility
            // clientX and clientY will be 0 if the click event was triggered by a keyboard event
            if (e.clientX > 0 || e.clientY > 0) onClose()
          }}
          onKeyDown={(e) => {
            // dismiss the modal when enter or space is pressed on an option
            if (e.key === "Enter" || e.key === " ") onClose()
          }}
        >
          <div className="row-span-2 row-start-1">
            <AssetLogoWithUnderlyings
              className="h-9 w-9 drop-shadow md:h-10 md:w-10"
              tokenAddress={tokenAddress}
              underlyingAssets={underlyingAssets}
            />
          </div>
          <h2 className="col-start-2 row-start-1 text-left font-medium">
            <AssetSymbol address={tokenAddress} />
          </h2>
          <h3 className="col-start-2 row-start-2 text-left text-sm">
            <AssetName address={tokenAddress} />
          </h3>
        </button>
      </RadioGroup.Item>
    )
  }
)
