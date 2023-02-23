import Link from "next/link"
import { FC } from "react"
import { BiHelpCircle } from "react-icons/bi"
import { SiDiscord, SiGitbook, SiGithub, SiTwitter } from "react-icons/si"

import clsxm from "@/lib/clsxm"

type ExternalLinksProps = {
  className?: string
  showHelp?: boolean
  showLabels?: boolean
}

const ExternalLinks: FC<ExternalLinksProps> = ({
  className,
  showHelp = false,
  showLabels = false,
}) => {
  return (
    <nav
      className={clsxm(
        "flex justify-center gap-6 fill-white md:justify-end",
        className
      )}
      aria-label="Links"
    >
      <Link
        href="https://twitter.com/fortress_fi"
        className="flex items-center gap-3"
        target="_blank"
      >
        <SiTwitter className="h-5 w-5 fill-current" />
        {showLabels && <span>@fortress_fi</span>}
      </Link>
      <Link
        href="https://github.com/FortressFinance"
        className="flex items-center gap-3"
        target="_blank"
      >
        <SiGithub className="h-5 w-5 fill-current" />
        {showLabels && <span>GitHub</span>}
      </Link>
      <Link
        href="https://docs.fortress.finance"
        className="flex items-center gap-3"
        target="_blank"
      >
        <SiGitbook className="h-5 w-5 fill-current" />
        {showLabels && <span>Documentation</span>}
      </Link>
      <Link
        href="https://discord.gg/HnD3JsDKGy"
        className="flex items-center gap-3"
        target="_blank"
      >
        <SiDiscord className="h-5 w-5 fill-current" />
        {showLabels && <span>Discord</span>}
      </Link>
      {showHelp && (
        <Link
          href="https://i.redd.it/loxkwqhjakd61.png"
          className="flex items-center gap-3"
          target="_blank"
        >
          <BiHelpCircle className="h-5 w-5 fill-current" />
          {showLabels && <span>Help</span>}
        </Link>
      )}
    </nav>
  )
}

export default ExternalLinks
