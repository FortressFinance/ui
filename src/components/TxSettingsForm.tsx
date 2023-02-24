import { Switch } from "@headlessui/react"
import { FC, Fragment } from "react"
import { useForm } from "react-hook-form"

import clsxm from "@/lib/clsxm"

import { TxSettingsStore, useTxSettings } from "@/store/txSettings"

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

  return (
    <form className="space-y-1">
      <h1 className="text-sm font-semibold">Transaction settings</h1>
      <div className="space-y-2">
        <label className="text-xs font-semibold" htmlFor="slippageTolerance">
          Slippage tolerance
        </label>
        <div className="flex gap-2">
          <Switch
            as={Fragment}
            checked={txSettings.isSlippageAuto}
            onChange={txSettings.toggleSlippageAuto}
          >
            {({ checked }) => (
              <button
                className={clsxm("rounded-lg px-6 py-2 text-xs", {
                  "bg-black": checked,
                  "bg-black/25": !checked,
                })}
              >
                Auto
              </button>
            )}
          </Switch>

          <div className="grid grid-cols-[auto,1fr] grid-rows-1">
            <input
              className="peer relative z-[1] col-start-1 row-start-1 w-full bg-transparent py-2 pl-3 pr-1 text-right text-black focus:outline-none disabled:text-white/75"
              disabled={txSettings.isSlippageAuto}
              type="number"
              id="slippageTolerance"
              {...form.register("slippageTolerance", {
                valueAsNumber: true,
                onChange: (e) =>
                  txSettings.setSlippageTolerance(e.target.value),
              })}
            />
            <span className="relative z-[1] col-start-2 row-start-1 py-2 pr-3 pl-1 text-black peer-disabled:text-white/75">
              %
            </span>

            {/* Focus styles */}
            <div className="col-span-2 col-start-1 row-span-1 row-start-1 rounded-lg border border-transparent bg-white peer-focus:border-black peer-disabled:border-black/0 peer-disabled:bg-white/25">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default TxSettingsForm
