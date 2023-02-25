import { Disclosure, Transition } from "@headlessui/react"
import {
  Dispatch,
  FC,
  Fragment,
  MouseEventHandler,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react"

import clsxm from "@/lib/clsxm"
import { VaultProps } from "@/lib/types"
import { useVault } from "@/hooks/data/vaults"

import { AssetLogo } from "@/components/Asset"
import Button from "@/components/Button"
import { TableCell, TableRow } from "@/components/Table"
import { GradientText } from "@/components/Typography"
import {
  VaultApy,
  VaultDepositedLpTokens,
  VaultName,
  VaultTvl,
} from "@/components/Vault/VaultData"
import VaultDepositForm from "@/components/Vault/VaultDepositForm"
import { VaultModalMobile } from "@/components/Vault/VaultModalMobile"
import VaultStrategyModal from "@/components/Vault/VaultStrategy"
import VaultWithdrawForm from "@/components/Vault/VaultWithdrawForm"

import { FortIconChevronDownCircle } from "@/icons"

const VaultRow: FC<VaultProps> = (props) => {
  const [isStrategyOpen, setIsStrategyOpen] = useState(false)
  const [isVaultOpen, setIsVaultOpen] = useState(false)

  return (
    <>
      {/* Desktop vaults */}
      <Disclosure as={Fragment} key={props.asset}>
        <VaultContent
          className="max-md:hidden"
          isVaultOpen={isVaultOpen}
          setIsStrategyOpen={setIsStrategyOpen}
          setIsVaultOpen={setIsVaultOpen}
          {...props}
        >
          <Transition
            show={isVaultOpen}
            className="col-span-full overflow-hidden max-md:hidden"
            enter="transition-all duration-200"
            enterFrom="transform opacity-0 max-h-0"
            enterTo="transform opacity-100 max-h-[1000px] md:max-h-80"
            leave="transition-all duration-200"
            leaveFrom="transform opacity-100 max-h-[1000px] md:max-h-80"
            leaveTo="transform opacity-0 max-h-0"
          >
            <Disclosure.Panel static>
              <div className="mt-6 grid gap-3 md:grid-cols-2 md:gap-4">
                <VaultDepositForm {...props} />
                <VaultWithdrawForm {...props} />
              </div>
            </Disclosure.Panel>
          </Transition>
        </VaultContent>
      </Disclosure>

      {/* Mobile vaults */}
      <VaultContent
        className="md:hidden"
        isVaultOpen={isVaultOpen}
        setIsStrategyOpen={setIsStrategyOpen}
        setIsVaultOpen={setIsVaultOpen}
        {...props}
      >
        <VaultModalMobile {...props} />
      </VaultContent>

      <VaultStrategyModal
        isOpen={isStrategyOpen}
        onClose={() => setIsStrategyOpen(false)}
        {...props}
      />
    </>
  )
}

export default VaultRow

type VaultContentProps = VaultProps & {
  className: string
  isVaultOpen: boolean
  setIsStrategyOpen: Dispatch<SetStateAction<boolean>>
  setIsVaultOpen: Dispatch<SetStateAction<boolean>>
}

const VaultContent: FC<PropsWithChildren<VaultContentProps>> = ({
  children,
  className,
  isVaultOpen,
  setIsStrategyOpen,
  setIsVaultOpen,
  ...props
}) => {
  const { isLoading } = useVault(props)

  const toggleVaultOpen: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsVaultOpen((v) => !v)
  }

  return (
    <TableRow
      className={clsxm("md:py-6 md:first:rounded-t-none", className)}
      onClick={toggleVaultOpen}
      disabled={isLoading}
    >
      {/* Row of vault info */}
      <TableCell className="relative grid grid-cols-[max-content,auto,max-content] items-center gap-x-3 max-md:mb-3 max-md:border-b max-md:border-b-pink/30 max-md:pb-3.5 md:pointer-events-none">
        <AssetLogo
          name={props.type}
          className="flex h-12 w-12"
          tokenAddress={props.asset}
        />

        <span className="line-clamp-2">
          <VaultName {...props} />
        </span>

        {/* Large: strategy button */}
        <Button
          className="focus-visible-outline-1 pointer-events-auto relative ring-orange-400 transition-transform duration-150 after:absolute after:inset-0 after:rounded after:opacity-0 after:shadow-button-glow after:transition-opacity after:duration-300 focus:outline-none focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-orange focus-visible:contrast-150 focus-visible:after:opacity-100 active:translate-y-0 enabled:hover:-translate-y-0.5 enabled:hover:contrast-150 enabled:hover:after:opacity-100 max-lg:hidden"
          size="base"
          variant="outline"
          onClick={() => setIsStrategyOpen(true)}
        >
          <GradientText>Strategy</GradientText>
        </Button>

        {/* Medium: strategy button */}
        <Button
          className="focus-visible-outline-1 pointer-events-auto relative ring-orange-400 transition-transform duration-150 after:absolute after:inset-0 after:rounded after:opacity-0 after:shadow-button-glow after:transition-opacity after:duration-300 focus:outline-none focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-orange focus-visible:contrast-150 focus-visible:after:opacity-100 active:translate-y-0 max-md:hidden md:enabled:hover:-translate-y-0.5 md:enabled:hover:contrast-150 md:enabled:hover:after:opacity-100 lg:hidden"
          size="small"
          variant="outline"
          onClick={() => setIsStrategyOpen(true)}
        >
          <GradientText>Strategy</GradientText>
        </Button>
      </TableCell>

      {/* Desktop: APY, TVL, Balance */}
      <TableCell className="pointer-events-none text-center max-md:hidden">
        <VaultApy {...props} />
      </TableCell>
      <TableCell className="pointer-events-none text-center max-md:hidden">
        <VaultTvl {...props} />
      </TableCell>
      <TableCell className="pointer-events-none text-center max-md:hidden">
        <VaultDepositedLpTokens {...props} />
      </TableCell>

      {/* Mobile: APY, TVL, Balance */}
      <TableCell className="md:hidden">
        <dl className="grid grid-cols-3 gap-x-3 text-center">
          <dt className="row-start-2 text-xs text-pink-100/60">APY</dt>
          <dd className="text-sm font-medium text-orange-100">
            <VaultApy {...props} />
          </dd>
          <dt className="row-start-2 text-xs text-pink-100/60">TVL</dt>
          <dd className="text-sm font-medium text-orange-100">
            <VaultTvl {...props} />
          </dd>
          <dt className="row-start-2 text-xs text-pink-100/60">Balance</dt>
          <dd className="text-sm font-medium text-orange-100">
            <VaultDepositedLpTokens {...props} />
          </dd>
        </dl>
      </TableCell>

      {/* Desktop: Action buttons */}
      <TableCell className="relative flex items-center max-md:hidden">
        <button
          className="group absolute inset-0 flex items-center justify-end focus:outline-none"
          disabled={isLoading}
          onClick={toggleVaultOpen}
        >
          <div
            className={clsxm(
              "group z-[1] block h-5 w-5 rounded-sm transition-transform duration-200 group-focus-visible:outline-double",
              {
                "cursor-wait": isLoading,
                "-rotate-180": isVaultOpen,
              }
            )}
          >
            <FortIconChevronDownCircle
              className="h-5 w-5 fill-white"
              aria-label="Open vault"
            />
          </div>
        </button>
      </TableCell>

      {/* Mobile: Action buttons */}
      <TableCell className="mt-3 mb-0.5 flex gap-3 border-t border-t-pink/30 pt-3.5 md:hidden">
        <Button className="w-3/5" onClick={() => setIsVaultOpen(true)}>
          <div className="flex items-center justify-center gap-2">
            <span>Expand Vault</span>
          </div>
        </Button>

        <Button
          className="pointer-events-auto w-2/5 md:hidden"
          variant="outline"
          size="small"
          onClick={() => setIsStrategyOpen(true)}
        >
          <GradientText>Strategy</GradientText>
        </Button>
      </TableCell>

      {/* Insert mobile/desktop 'expanded' element here */}
      {children}
    </TableRow>
  )
}
