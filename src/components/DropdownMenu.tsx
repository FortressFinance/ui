import { Menu, Transition } from "@headlessui/react"
import Link, { LinkProps } from "next/link"
import { forwardRef, Fragment, PropsWithChildren } from "react"

import clsxm from "@/lib/clsxm"

import ChevronDown from "~/svg/icons/chevron-down.svg"

type DropdownMenuProps = PropsWithChildren<{ className?: string }>

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, ...props }, ref) => {
    return <div className={clsxm("relative", className)} ref={ref} {...props} />
  }
)

type DropdownMenuButtonProps = PropsWithChildren<
  Parameters<typeof Menu.Button>[0]
>

export const DropdownMenuButton = forwardRef<
  HTMLButtonElement,
  DropdownMenuButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <button
      className={clsxm(
        "group flex items-center gap-2 stroke-white hover:stroke-orange-400 hover:text-orange-400",
        {
          "stroke-orange-400 text-orange-400": props["aria-expanded"] === true,
        },
        className
      )}
      ref={ref}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown className="w-3 stroke-inherit" />
    </button>
  )
})

type DropdownMenuItemsProps = PropsWithChildren<
  Parameters<typeof Menu.Items>[0]
>

export const DropdownMenuItems = forwardRef<
  HTMLDivElement,
  DropdownMenuItemsProps
>(({ className, ...props }, ref) => {
  return (
    <Transition
      as={Fragment}
      enter="transition-all duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-all duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={clsxm(
          "absolute left-0 top-0 min-w-[12rem] translate-y-8 divide-y divide-pink-700 rounded-md border border-pink-700 bg-pink-900",
          className
        )}
        ref={ref}
        {...props}
      />
    </Transition>
  )
})

type DropdownMenuItemProps = LinkProps & { className?: string }

export const DropdownMenuItem = forwardRef<
  HTMLAnchorElement,
  DropdownMenuItemProps
>(({ className, ...props }, ref) => {
  return (
    <Link
      className={clsxm("block px-3 py-2.5 hover:text-orange-400", className)}
      ref={ref}
      {...props}
    />
  )
})
