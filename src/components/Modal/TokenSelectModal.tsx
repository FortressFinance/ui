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

import { FortIconCloseCircle } from "@/icons"

type TokenSelectModalProps = ModalBaseProps & {
  asset?: Address
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controller: UseControllerReturn<any, any>
  title?: string
  tokens: Array<{ address?: Address; badge?: string }>
  tokenAddresses?: Address[] | readonly Address[]
  onChangeToken: () => void
}

const TokenSelectModal: FC<TokenSelectModalProps> = ({
  asset,
  controller: {
    field: { onChange: controllerOnChange, ...controllerField },
  },
  isOpen,
  title = "Select a token",
  tokens,
  onClose,
  onChangeToken,
}) => {
  return (
    <PurpleModal className="max-w-md" isOpen={isOpen} onClose={onClose}>
      <PurpleModalContent>
        <header className="mb-4 flex items-center justify-between">
          <Dialog.Title className="text-xl">{title}</Dialog.Title>
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
          {tokens
            ?.filter(
              (token): token is { address: Address; badge?: string } =>
                !!token.address
            )
            .map(({ address, badge }, index) => (
              <TokenSelectOption
                key={`option-${index}`}
                badge={badge}
                tokenAddress={address}
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
  badge?: string
  tokenAddress: Address
  underlyingAssets?: Address[]
  onClose: () => void
}

const TokenSelectOption = forwardRef<HTMLButtonElement, TokenSelectOptionProps>(
  ({ badge, tokenAddress, underlyingAssets, onClose }, ref) => {
    return (
      <RadioGroup.Item ref={ref} value={tokenAddress} asChild>
        <button
          className="group grid w-full grid-cols-[auto,1fr] grid-rows-[1fr,auto] items-center gap-x-2 rounded-lg p-2 ui-state-checked:bg-white/80 ui-state-checked:text-pink-900 ui-state-unchecked:bg-black ui-state-unchecked:text-white md:gap-x-3 md:p-3"
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
          <h2 className="col-start-2 row-start-1 flex items-center gap-1.5 text-left font-medium">
            <AssetSymbol address={tokenAddress} />
            {badge && (
              <span className="inline-flex -translate-y-[1px] items-center rounded-full bg-white/80 px-2 py-0.5 text-2xs font-medium uppercase text-black group-ui-state-checked:bg-black group-ui-state-checked:text-white">
                {badge}
              </span>
            )}
          </h2>
          <h3 className="col-start-2 row-start-2 text-left text-sm">
            <AssetName address={tokenAddress} />
          </h3>
        </button>
      </RadioGroup.Item>
    )
  }
)
