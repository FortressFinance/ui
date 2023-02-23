import clsx from "clsx"
import { forwardRef, MouseEventHandler } from "react"
import { Address } from "wagmi"

import useTokenOrNativeBalance from "@/hooks/useTokenOrNativeBalance"

import { AssetBalance, AssetSymbol } from "@/components/Asset"

type TokenInputProps = {
  address: Address
  className?: string
  onClickMax: (amount: string) => void
}

const TokenInput = forwardRef<HTMLInputElement, TokenInputProps>(
  ({ address, className, onClickMax: _onClickMax, ...inputProps }, ref) => {
    const { data: balance } = useTokenOrNativeBalance({ address })

    const onClickMax: MouseEventHandler<HTMLButtonElement> = () =>
      _onClickMax(balance?.formatted ?? "0.0")

    return (
      <div className="grid-row-[1fr,auto] grid w-full grid-cols-[auto,auto] rounded-md">
        <input
          ref={ref}
          className={clsx(
            "peer relative z-[1] col-start-1 row-start-1 block w-full text-ellipsis bg-transparent p-4 pb-3 text-2xl placeholder-white/50 focus:outline-none md:text-4xl",
            className
          )}
          step="any"
          type="number"
          placeholder="0.0"
          {...inputProps}
        />
        <div className="relative z-[1] col-span-full col-start-1 row-start-2 px-4 pb-3 text-right text-xs">
          <span>
            Balance: <AssetBalance address={address} />
          </span>
          <button
            className="ml-1.5 rounded-md font-bold text-white"
            onClick={onClickMax}
            type="button"
          >
            Max
          </button>
        </div>
        <div className="col-start-2 row-span-2 row-start-1 flex items-start p-4">
          <div className="rounded-md bg-white py-2.5 px-3.5 text-sm font-medium text-black">
            <AssetSymbol address={address} />
          </div>
        </div>
        <div
          className="col-span-full col-start-1 row-span-2 row-start-1 rounded-md bg-white/10 peer-focus:outline peer-focus:outline-white/30"
          aria-hidden="true"
        />
      </div>
    )
  }
)

export default TokenInput
