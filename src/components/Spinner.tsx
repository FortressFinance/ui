import clsx from "clsx"
import { FC } from "react"
import { BiLoaderAlt } from "react-icons/bi"

type SpinnerProps = {
  className?: string
}

const Spinner: FC<SpinnerProps> = ({ className }) => (
  <BiLoaderAlt className={clsx("inline animate-spin", className)} />
)

export default Spinner
