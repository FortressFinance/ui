import { Combobox, Dialog } from "@headlessui/react"
import { FC, Fragment, useState } from "react"
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
  onClose: _onClose,
  tokenAddresses,
}) => {
  const [query, setQuery] = useState("")
  const { data: tokens } = useTokensOrNative({ addresses: tokenAddresses })

  const filteredTokens =
    query === ""
      ? tokens
      : tokens?.filter(
          (token) =>
            token.name.toLowerCase().includes(query.toLowerCase()) ||
            token.symbol.toLowerCase().includes(query.toLowerCase()) ||
            token.address.toLowerCase() === query.trim().toLowerCase()
        ) ?? []
  const sortedTokens = filteredTokens?.sort((a, b) =>
    a.balance.value.lt(b.balance.value) ? 1 : -1
  )

  const onClose = () => {
    setQuery("")
    _onClose()
  }

  const onChange = (value: Address) => {
    controller.field.onChange(value)
    onClose()
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

        <Combobox as="div" {...controller.field} onChange={onChange}>
          <Combobox.Input
            as={Fragment}
            onChange={(e) => setQuery(e.target.value)}
            displayValue={() => query}
          >
            <input
              className="mt-4 w-full rounded-md border border-pink-700 bg-transparent px-3 py-2 text-white/80"
              type="text"
              value={query}
              placeholder="Search name or paste address"
            />
          </Combobox.Input>
          <Combobox.Options className="mt-4 space-y-2" static>
            {sortedTokens?.map((token, index) => (
              <Combobox.Option
                as={Fragment}
                key={`token-${index}`}
                value={token.address}
                // disabled={token.balance.formatted === "0.0"}
              >
                {({ active, disabled, selected }) => (
                  <li
                    ref={controller.field.ref}
                    className={clsxm(
                      "grid grid-cols-[auto,1fr] grid-rows-[1fr,auto] items-center gap-x-2 rounded-md p-2",
                      {
                        "bg-white/80 text-black": selected,
                        "bg-black text-white": !selected,
                        "opacity-50": disabled,
                        "cursor-pointer": !disabled,
                        "outline outline-white": active,
                      }
                    )}
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
                  </li>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </PurpleModalContent>
    </PurpleModal>
  )
}

export default TokenSelectModal
