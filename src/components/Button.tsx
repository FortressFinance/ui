import clsx from "clsx"
import Link, { LinkProps } from "next/link"
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  PropsWithChildren,
} from "react"

import clsxm from "@/lib/clsxm"

import Spinner from "@/components/Spinner"

type ButtonSize = "base" | "large" | "small"
type ButtonVariant = "base" | "plain" | "plain-negative"

interface ButtonProps
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
    "inline-grid grid-cols-1 grid-rows-1 items-center justify-center rounded-md px-5 py-3 disabled:opacity-75",
    {
      "text-lg lg:text-xl": size === "large",
      "text-xs lg:text-xs": size === "small",
      "bg-gradient-to-r from-orange to-pink": variant === "base",
      "bg-white shadow-[0_0_0_2px_#000] text-black": variant === "plain",
      "bg-black shadow-[0_0_0_2px_#000] text-white":
        variant === "plain-negative",
      "cursor-wait": isLoading,
      "disabled:cursor-not-allowed": !isLoading,
    },
    className
  )

const Button: FC<ButtonProps> = ({
  children,
  className,
  disabled,
  isLoading,
  size,
  variant,
  ...props
}) => {
  return (
    <button
      aria-disabled={disabled || isLoading}
      className={buttonClasses(className, isLoading, size, variant)}
      disabled={disabled || isLoading}
      {...props}
    >
      <span
        className={clsx("col-start-1 row-start-1", { "opacity-25": isLoading })}
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
