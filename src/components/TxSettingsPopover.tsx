import { Popover, Switch, Transition } from "@headlessui/react"
import { FC, Fragment } from "react"
import { useForm } from "react-hook-form"

import clsxm from "@/lib/clsxm"

import Button from "@/components/Button"

import { FortIconCog } from "@/icons"

import { TxSettingsStore, useTxSettings } from "@/store/txSettings"

import { DEFAULT_SLIPPAGE } from "@/constant/env"

type TxSettingsPopoverProps = {
  className?: string
}

export const TxSettingsPopover: FC<TxSettingsPopoverProps> = ({
  className,
}) => {
  return (
    <Popover className="max-md:h-12 max-md:w-12 md:relative md:flex md:justify-end">
      {({ open }) => (
        <>
          <Popover.Button as={Fragment}>
            <button
              className={clsxm(
                "relative flex items-center justify-center transition-transform duration-200 max-md:h-full max-md:w-full max-md:rounded-sm max-md:bg-black/30 max-md:p-3 md:h-5 md:w-5 md:justify-center",
                { "md:-rotate-180": open },
                className
              )}
            >
              <FortIconCog className="h-5 w-5 fill-white" />
              <span className="sr-only">Transaction settings</span>
            </button>
          </Popover.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition-all duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-all duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Panel
              as="div"
              className="absolute right-0 z-20 mt-2 rounded border border-black/60 bg-orange-400 p-4 shadow-lg max-md:absolute max-md:left-0 max-md:w-full md:-bottom-3 md:-mr-6 md:w-72 md:translate-y-full md:rounded-md md:rounded-t-none md:border-t-0 md:shadow-pink-900/50"
              static
            >
              <TxSettingsForm />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

type TxSettingsFormValues = Pick<
  TxSettingsStore,
  "slippageTolerance" | "txDeadlineMinutes"
>

const TxSettingsForm: FC = () => {
  const txSettings = useTxSettings()

  const form = useForm<TxSettingsFormValues>({
    values: {
      slippageTolerance: txSettings.slippageTolerance,
      txDeadlineMinutes: txSettings.txDeadlineMinutes,
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  const onClickAuto = () => {
    if (!txSettings.isSlippageAuto) {
      txSettings.setSlippageTolerance(DEFAULT_SLIPPAGE)
      txSettings.toggleSlippageAuto()
    }
  }

  return (
    <form>
      <h1 className="mb-2 md:text-lg">Transaction settings</h1>
      <div>
        <label className="mb-3 block font-medium" htmlFor="slippageTolerance">
          Slippage tolerance
        </label>
        <div className="grid grid-cols-[1fr,2fr] gap-2">
          {/* Auto switch */}
          <Switch
            as={Button}
            className="shrink-0 text-base ui-not-checked:opacity-20"
            size="small"
            variant="plain-negative"
            checked={txSettings.isSlippageAuto}
            onChange={onClickAuto}
          >
            Auto
          </Switch>

          {/* Input */}
          <div className="grid h-full grid-cols-[auto,1fr] grid-rows-1">
            <input
              className="relative z-[1] col-start-1 row-start-1 w-full bg-transparent pl-3 pr-1 text-right text-xl text-black focus:outline-none"
              type="number"
              id="slippageTolerance"
              {...form.register("slippageTolerance", {
                valueAsNumber: true,
                onChange: (e) => {
                  if (txSettings.isSlippageAuto) {
                    txSettings.toggleSlippageAuto()
                  }
                  txSettings.setSlippageTolerance(e.target.value)
                },
              })}
            />
            <span className="relative z-[1] col-start-2 row-start-1 self-center pr-3 pl-1 text-xl text-black">
              %
            </span>

            {/* Focus styles */}
            <div className="col-span-2 col-start-1 row-span-1 row-start-1 rounded bg-white ring-1 ring-inset ring-black">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
