import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"
import { FiChevronRight } from "react-icons/fi"

import clsxm from "@/lib/clsxm"
import { resolvedRoute } from "@/lib/helpers"
import { useActiveChainId, useClientReady } from "@/hooks"

import { GradientText } from "@/components/Typography"

import { lendingPairs } from "@/constant"

export const LeverPairs: FC = () => {
  const isClientReady = useClientReady()
  const router = useRouter()
  const chainId = useActiveChainId()
  const chainLendingPairs = lendingPairs.filter((n) => n.chainId === chainId)

  return (
    <NavigationMenu.Root
      orientation="vertical"
      className="rounded-lg bg-pink-900/80"
    >
      <div className="rounded-t-lg border-b border-b-pink/30 p-3 text-sm text-pink-100 lg:px-4">
        Assets
      </div>
      <NavigationMenu.List className="divide-y divide-pink/30">
        {isClientReady ? (
          chainLendingPairs.length ? (
            chainLendingPairs.map((lendingPair, index) => {
              const isActive = router.asPath.includes(lendingPair.pairAddress)
              return (
                <NavigationMenu.Item key={lendingPair.pairAddress}>
                  <NavigationMenu.Link asChild>
                    <Link
                      {...resolvedRoute(
                        `/app/lever/${lendingPair.pairAddress}`
                      )}
                      className={clsxm(
                        "flex items-center justify-between px-3 py-4 pl-4 text-lg font-light lg:p-4 lg:pl-5",
                        { "font-semibold text-pink": isActive },
                        {
                          "rounded-b-lg":
                            index === chainLendingPairs.length - 1,
                        }
                      )}
                    >
                      {isActive ? (
                        <GradientText>{lendingPair.name}</GradientText>
                      ) : (
                        <span>{lendingPair.name}</span>
                      )}
                      <FiChevronRight className="-mr-1 h-6 w-6" />
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              )
            })
          ) : (
            <div className="p-3 text-sm text-pink-50">
              It seems we don't have any eligible assets available on this
              network (yet). New lending pairs are added often are added often,
              so check back later. Don't be a stranger.
            </div>
          )
        ) : null}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
