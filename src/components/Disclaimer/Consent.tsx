import { Dialog } from "@headlessui/react"
import { FC, useEffect, useState } from "react"

import Button from "@/components/Button"
import PurpleModal, {
  PurpleModalContent,
  PurpleModalHeader,
} from "@/components/Modal/PurpleModal"

import useConsentStorage from "@/store/consent"

export const Consent: FC = () => {
  const consent = useConsentStorage((state) => state.consent)
  const understandDisclaimer = useConsentStorage(
    (state) => state.understandDisclaimer
  )
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    understandDisclaimer()
    setIsOpen(false)
  }

  useEffect(() => {
    if (!consent) {
      setIsOpen(true)
    }
  }, [setIsOpen, consent])

  return (
    <>
      <PurpleModal className="w-auto" isOpen={isOpen} onClose={() => null}>
        <PurpleModalHeader>
          <Dialog.Title
            as="h3"
            className="font-base text-pink-100 focus:outline-none md:text-xl"
            tabIndex={0}
          >
            DISCLAIMER
          </Dialog.Title>
        </PurpleModalHeader>
        <PurpleModalContent>
          <div className="w-full max-w-prose text-pink-100 max-md:text-xs md:leading-relaxed">
            <p className="mb-3">
              Fortress Finance is a web-based user interface that enables you to
              interact with a set of decentralised autonomous smart-contract
              system deployed on the Ethereum Virtual Machine-compatible
              blockchain networks.
            </p>
            <p className="mb-2">
              By interacting or attempting to interact (in both cases,
              “interacting”) with Fortress Finance, you confirm that you not a
              person subject or target of any sanctions, including a person that
              is:
            </p>
            <ul className="list-inside list-disc">
              <li>
                named in any Sanctions-related list maintained by the U.S.
                Department of State; the U.S. Department of Commerce, including
                the Bureau of Industry and Security’s Entity List and Denied
                Persons List; or the U.S. Department of the Treasury, including
                the OFAC Specially Designated Nationals and Blocked Persons
                List, the Sectoral Sanctions Identifications List, and the
                Foreign Sanctions Evaders List; or any similar list maintained
                by any other relevant governmental authority;{" "}
              </li>
              <li>
                located, organized or resident in a country, territory or
                geographical region which is itself the subject or target of any
                territory-wide Sanctions (a “Restricted Territory”) (currently,
                but not limited to the Crimea region of Ukraine, Cuba, Iran,
                North Korea, and Syria); or{" "}
              </li>
              <li>
                citizen or resident of, or person subject to jurisdiction of the
                United States of America (including its territories: American
                Samoa, Guam, Puerto Rico, the Northern Mariana Islands and the
                U.S. Virgin Islands), and any jurisdiction in which the use of
                the Platform is prohibited by applicable laws or regulation.
              </li>
            </ul>
          </div>
          <div className="mt-4 md:mt-6">
            <Button
              className="inline-flex w-full justify-center px-4 py-2 text-sm font-medium"
              size="large"
              onClick={closeModal}
            >
              I understand
            </Button>
          </div>
          <div className="mt-4 mb-2 text-center">
            <a
              href="about:blank"
              className="text-sm text-pink-100/50 underline"
            >
              Leave site
            </a>
          </div>
        </PurpleModalContent>
      </PurpleModal>
    </>
  )
}
