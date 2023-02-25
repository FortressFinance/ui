import { Dialog } from "@headlessui/react"
import { FC, useEffect, useState } from "react"

import Button from "@/components/Button"
import PurpleModal, {
  PurpleModalContent,
  PurpleModalHeader,
} from "@/components/Modal/PurpleModal"

import useConsentStorage from "@/store/useConsentStorage"

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
              Fortress Finance is a set of smart contracts made available by
              Fortress.Finance on a voluntary, “as-is” and “as available” basis.
              By interacting or attempting to interact (in both cases,
              “interacting”) with Fortress Finance, you confirm that you
              understand and agree to these terms:
            </p>
            <p className="mb-3">
              Nature of Fortress Finance: The protocol is completely
              decentralized, Fortress.Finance is not involved in any
              transactions, whether as an intermediary, counterparty, advisor or
              otherwise.
            </p>
            <p className="mb-3">
              You are not a US Person; you are not a resident, national, or
              agent of Antigua and Barbuda, Algeria, Bangladesh, Bolivia,
              Belarus, Burundi, Burma (Myanmar), Cote D’Ivoire (Ivory Coast),
              Crimea and Sevastopol, Cuba, Democratic Republic of Congo,
              Ecuador, Iran, Iraq, Liberia, Libya, Magnitsky, Mali, Morocco,
              Nepal, North Korea, Somalia, Sudan, Syria, Venezuela, Yemen,
              Zimbabwe or any other country to which the United States, the
              United Kingdom or the European Union embargoes goods or imposes
              similar sanctions; you are not a member of any sanctions list or
              equivalent maintained by the United States government, the United
              Kingdom government, the European Union, or the United Nations; you
              do intend to transact with any Restricted Person or Sanctions List
              Person; you do not, and will not, use VPN software or any other
              privacy or anonymization tools or techniques to circumvent, or
              attempt to circumvent, any restrictions.
            </p>
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
