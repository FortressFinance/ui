import { FC } from "react"
import { BiLoaderAlt } from "react-icons/bi"

import clsxm from "@/lib/clsxm"

type SpinnerProps = {
  className?: string
}

const Spinner: FC<SpinnerProps> = ({ className }) => (
  <BiLoaderAlt className={clsxm("inline animate-spin", className)} />
)

export default Spinner
