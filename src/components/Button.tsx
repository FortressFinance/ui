import clsx from "clsx"
import Link, { LinkProps } from "next/link"
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  forwardRef,
  PropsWithChildren,
} from "react"

import clsxm from "@/lib/clsxm"

import Spinner from "@/components/Spinner"

type ButtonSize = "base" | "large" | "small"
type ButtonVariant = "base" | "plain" | "plain-negative" | "outline"

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isLoading?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
}

const buttonClasses = (
  className?: string,
  isLoading?: boolean,
  size: ButtonSize = "base",
  variant: ButtonVariant = "base"
) =>
  clsxm(
    "inline-grid grid-cols-1 grid-rows-1 font-medium items-center justify-center rounded px-5 py-3 disabled:opacity-75",
    {
      "text-lg lg:text-xl": size === "large",
      "text-sm p-3": size === "small",
      "bg-gradient-to-r from-orange to-pink": variant === "base",
      "ring ring-1 ring-pink text-white bg-pink bg-opacity-10 ring-inset":
        variant === "outline",
      "bg-white ring ring-1 ring-black ring-inset text-black":
        variant === "plain",
      "bg-black ring ring-1 ring-black ring-inset text-white":
        variant === "plain-negative",
      "cursor-wait": isLoading,
      "disabled:cursor-not-allowed": !isLoading,
    },
    className
  )

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, disabled, isLoading, size, variant, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        aria-disabled={disabled || isLoading}
        className={buttonClasses(className, isLoading, size, variant)}
        disabled={disabled || isLoading}
        {...props}
      >
        <span
          className={clsx(
            "col-start-1 row-start-1 overflow-hidden text-ellipsis whitespace-nowrap",
            { "opacity-25": isLoading }
          )}
        >
          {children}
        </span>
        {isLoading && (
          <Spinner
            className={clsxm(
              "col-start-1 row-start-1 mx-auto h-full w-auto animate-spin",
              {
                "fill-white": variant === "base",
                "fill-black": variant === "plain",
              }
            )}
          />
        )}
      </button>
    )
  }
)

export default Button

interface ButtonLinkProps extends LinkProps {
  className?: string
  external?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
}

export const ButtonLink: FC<PropsWithChildren<ButtonLinkProps>> = ({
  children,
  className,
  external,
  size,
  variant,
  ...props
}) => {
  return (
    <Link
      className={buttonClasses(className, false, size, variant)}
      {...props}
      {...(external ? { target: "_blank" } : {})}
    >
      {children}
    </Link>
  )
}
