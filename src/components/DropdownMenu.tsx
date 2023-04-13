import Link, { LinkProps } from "next/link"
import { forwardRef, PropsWithChildren } from "react"

import clsxm from "@/lib/clsxm"

import { FortIconChevronDown } from "@/icons"

type DropdownMenuProps = PropsWithChildren<{ className?: string }>

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, ...props }, ref) => {
    return <div className={clsxm("relative", className)} ref={ref} {...props} />
  }
)

type DropdownMenuButtonProps = PropsWithChildren<{ className?: string }>

export const DropdownMenuButton = forwardRef<
  HTMLButtonElement,
  DropdownMenuButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <button
      className={clsxm(
        "transition-color group flex items-center gap-2 stroke-white duration-200 hover:stroke-pink-300 hover:text-pink-300 ui-state-open:stroke-pink-300 ui-state-open:text-pink-300",
        className
      )}
      ref={ref}
      {...props}
    >
      <span>{children}</span>
      <FortIconChevronDown className="w-3.5 stroke-inherit" />
    </button>
  )
})

type DropdownMenuItemsProps = PropsWithChildren<{ className?: string }>

export const DropdownMenuItems = forwardRef<
  HTMLDivElement,
  DropdownMenuItemsProps
>(({ className, ...props }, ref) => {
  return (
    <div
      className={clsxm(
        "absolute left-0 top-0 min-w-[12rem] translate-y-8 divide-y divide-pink-700 overflow-hidden rounded-md border border-pink-700 bg-pink-900 focus-visible:outline-none ui-state-closed:animate-fade-out ui-state-open:animate-fade-in",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

type DropdownMenuItemLinkProps = LinkProps & { className?: string }

export const DropdownMenuItemLink = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<DropdownMenuItemLinkProps>
>(({ className, ...props }, ref) => {
  return (
    <Link
      className={clsxm(
        "block px-3 py-2.5 focus:outline-none focus-visible:bg-white focus-visible:text-pink-900",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
