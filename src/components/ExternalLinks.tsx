import Link from "next/link"
import { FC } from "react"
import { BiHelpCircle } from "react-icons/bi"
import { SiDiscord, SiGitbook, SiGithub, SiTwitter } from "react-icons/si"

import clsxm from "@/lib/clsxm"

type ExternalLinksProps = {
  className?: string
  showHelp?: boolean
}

const ExternalLinks: FC<ExternalLinksProps> = ({
  className,
  showHelp = false,
}) => {
  return (
    <nav className={clsxm("flex gap-6 justify-end", className)} aria-label="Links">
      <Link href="https://twitter.com/fortress_fi" target="_blank">
        <SiTwitter className="h-5 w-5" />
      </Link>
      <Link href="https://github.com/FortressFinance" target="_blank">
        <SiGithub className="h-5 w-5" />
      </Link>
      <Link href="https://docs.fortress.finance" target="_blank">
        <SiGitbook className="h-5 w-5" />
      </Link>
      <Link href="https://discord.gg/HnD3JsDKGy" target="_blank">
        <SiDiscord className="h-5 w-5" />
      </Link>
      {showHelp && (
        <span>
          <BiHelpCircle className="h-5 w-5" />
        </span>
      )}
    </nav>
  )
}

export default ExternalLinks
