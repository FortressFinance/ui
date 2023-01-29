import { FC, MouseEventHandler } from "react"
import { Address } from "wagmi"

import useTokenOrNative from "@/hooks/useTokenOrNative"

import Skeleton from "@/components/Skeleton"

import ChevronDown from "~/svg/icons/chevron-down.svg"

type TokenSelectButtonProps = {
  canChange?: boolean
  tokenAddress: Address
  onClick: MouseEventHandler<HTMLButtonElement>
}

const TokenSelectButton: FC<TokenSelectButtonProps> = ({
  canChange = false,
  tokenAddress,
  onClick,
}) => {
  const { data: token, isLoading: isLoadingToken } = useTokenOrNative({
    address: tokenAddress,
  })
  return canChange ? (
    <button
      type="button"
      className="flex items-center space-x-2 justify-self-end rounded-md bg-white py-2 px-3 text-xs font-medium text-black"
      onClick={onClick}
    >
      <Skeleton isLoading={isLoadingToken}>
        {isLoadingToken ? "Loading..." : token?.symbol ?? "Unknown token"}
      </Skeleton>
      <ChevronDown className="h-2 w-2 stroke-black" />
    </button>
  ) : (
    <div className="flex items-center space-x-2 justify-self-end rounded-md bg-white py-2 px-3 text-xs font-medium text-black">
      <Skeleton isLoading={isLoadingToken}>
        {isLoadingToken ? "Loading..." : token?.symbol ?? "Unknown token"}
      </Skeleton>
    </div>
  )
}

export default TokenSelectButton
