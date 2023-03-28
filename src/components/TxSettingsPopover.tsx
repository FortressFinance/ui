import { Popover, Switch, Transition } from "@headlessui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FC, FormEventHandler, Fragment, useEffect } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { BiInfoCircle } from "react-icons/bi"
import { z } from "zod"

import clsxm from "@/lib/clsxm"

import Button from "@/components/Button"
import Tooltip from "@/components/Tooltip"

import { FortIconCog } from "@/icons"

import { useGlobalStore } from "@/store"

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
              {({ close }) => <TxSettingsForm close={close} />}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

type TxSettingsFormProps = {
  close: () => void
}

type TxSettingsFormValues = {
  expertMode: boolean
  slippageToleranceString: string
}

const formValuesSchema = z.object({
  expertMode: z.boolean(),
  slippageToleranceString: z.coerce
    .number({
      invalid_type_error: "Invalid slippage percentage",
    })
    .positive({
      message: "Invalid slippage percentage",
    })
    .lt(100, { message: "Invalid slippage percentage" }),
})

const TxSettingsForm: FC<TxSettingsFormProps> = ({ close }) => {
  const [expertMode, setExpertMode, slippageTolerance, setSlippageTolerance] =
    useGlobalStore((store) => [
      store.expertMode,
      store.setExpertMode,
      store.slippageTolerance,
      store.setSlippageTolerance,
    ])

  const form = useForm<TxSettingsFormValues>({
    values: {
      expertMode,
      slippageToleranceString: String(slippageTolerance),
    },
    mode: "all",
    reValidateMode: "onChange",
    resolver: zodResolver(formValuesSchema),
  })
  const isAutoSlippage =
    form.watch("slippageToleranceString") === String(DEFAULT_SLIPPAGE)
  const slippageError = form.formState.errors.slippageToleranceString

  const submitHandler: SubmitHandler<TxSettingsFormValues> = (data) => {
    // we can't rely on the formState to be accurate while the component is being unmounted
    const parsedData = formValuesSchema.safeParse(data)
    if (parsedData.success) {
      setExpertMode(parsedData.data.expertMode)
      setSlippageTolerance(parsedData.data.slippageToleranceString)
    }
  }

  const closeHandler: FormEventHandler = (e) => {
    e.preventDefault()
    if (!form.formState.isDirty || form.formState.isValid) close()
  }

  useEffect(() => {
    // save form state to store on unmount to prevent edge-case user errors
    // e.g. user enters "32f", an error is shown, but "32" was already saved to store
    // in this case, user would be allowing 32% slippage and wouldn't realize it
    return () => {
      form.handleSubmit(submitHandler)()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <form onSubmit={closeHandler}>
      <h1 className="mb-2 font-medium">Transaction settings</h1>
      <div>
        <label
          className="mb-3 block text-sm font-medium"
          htmlFor="slippageTolerance"
        >
          Slippage tolerance
        </label>
        <div className="grid grid-cols-[1fr,2fr] gap-2">
          {/* Auto switch */}
          <Switch
            as={Button}
            className="shrink-0 ui-not-checked:bg-black/20 ui-not-checked:ring-transparent"
            variant="plain-negative"
            checked={isAutoSlippage}
            onChange={(checked: boolean) => {
              if (checked) {
                form.setValue(
                  "slippageToleranceString",
                  String(DEFAULT_SLIPPAGE),
                  {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  }
                )
              }
            }}
          >
            Auto
          </Switch>

          {/* Input */}
          <div className="grid h-full grid-cols-[auto,1fr] grid-rows-1">
            <input
              className="relative z-[1] col-start-1 row-start-1 w-full bg-transparent pl-3 pr-1 text-right text-xl text-black focus:outline-none"
              type="text"
              id="slippageTolerance"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              {...form.register("slippageToleranceString")}
            />
            <span className="relative z-[1] col-start-2 row-start-1 self-center pr-3 pl-1 text-xl text-black">
              %
            </span>

            {/* Focus styles */}
            <div className="col-span-2 col-start-1 row-span-1 row-start-1 rounded bg-white ring-1 ring-inset ring-black">
              &nbsp;
            </div>
          </div>

          {/* Error messaging */}
          {slippageError && (
            <div className="col-span-2 text-sm font-semibold">
              {slippageError.message}
            </div>
          )}
        </div>
      </div>
      <h1 className="mt-4 mb-2 font-medium">Transaction settings</h1>
      <div className="flex items-center justify-between">
        <label
          className="relative z-10 flex items-center gap-1 text-sm font-medium"
          htmlFor="expertMode"
        >
          Expert mode{" "}
          <Tooltip label="Only enable if you know what you're doing. Disable transaction confirmations in the UI.">
            <span>
              <BiInfoCircle className="h-5 w-5 cursor-pointer" />
            </span>
          </Tooltip>
        </label>
        <Controller
          name="expertMode"
          control={form.control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              className="group relative inline-flex h-6 w-12 items-center rounded-full ring-1 ring-inset ring-white/20 transition-all ui-checked:ring-orange"
            >
              <span className="sr-only">Enable expert mode</span>
              <span className="relative z-10 block h-6 w-6 rounded-full bg-white transition-transform ui-checked:translate-x-6" />
              <span className="absolute inset-0 rounded-full bg-gradient-to-t from-orange opacity-0 transition-opacity ui-checked:opacity-100" />
              <span className="opacity-1 absolute inset-0 rounded-full bg-gradient-to-t from-white/20 transition-opacity ui-checked:opacity-0" />
            </Switch>
          )}
        />
      </div>
    </form>
  )
}
