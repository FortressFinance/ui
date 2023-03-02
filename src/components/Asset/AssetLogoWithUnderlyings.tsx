import { FC, useMemo } from "react"
import { Address } from "wagmi"

import clsxm from "@/lib/clsxm"

import { AssetLogo, AssetLogoProps } from "@/components/Asset/AssetLogo"

type AssetLogoWithUnderlyingsProps = AssetLogoProps & {
  underlyingAssets?: Address[] | readonly Address[]
}

export const AssetLogoWithUnderlyings: FC<AssetLogoWithUnderlyingsProps> = ({
  className,
  tokenAddress,
  underlyingAssets,
}) => {
  const visibleUnderlyingAssets = useMemo(
    () => underlyingAssets?.slice(-3) ?? [],
    [underlyingAssets]
  )

  return (
    <div className={clsxm("relative grid grid-cols-3 grid-rows-3", className)}>
      <AssetLogo
        className="col-span-full col-start-1 row-span-full row-start-1 h-full w-full"
        tokenAddress={tokenAddress}
      />

      {!!visibleUnderlyingAssets.length && (
        <div className="relative z-10 col-start-3 row-span-full row-start-1 grid grid-cols-1 grid-rows-3 drop-shadow-md">
          {visibleUnderlyingAssets.map((underlyingAssetAddress) => (
            <div
              className="relative h-full w-full rounded-full ring-white"
              key={`${tokenAddress}-${underlyingAssetAddress}`}
            >
              <AssetLogo
                className="h-full w-full p-[1px]"
                tokenAddress={underlyingAssetAddress}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
