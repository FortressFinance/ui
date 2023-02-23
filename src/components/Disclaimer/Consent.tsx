import { Dialog, Transition } from "@headlessui/react"
import { FC, Fragment, useEffect, useState } from "react"

import useStorage from "@/hooks/util/useStorage"

import Button from "@/components/Button"

export const Consent: FC = () => {
  const { getItem, setItem } = useStorage()
  const expectedValue = "agreed"
  const agreed = getItem("disclaimer", "local")
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setItem("disclaimer", expectedValue, "local")
    setIsOpen(false)
  }

  useEffect(() => {
    if (!(agreed !== undefined && agreed === expectedValue)) {
      setIsOpen(true)
    }
  }, [setIsOpen, agreed, expectedValue])

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="pointer-events: none relative z-10"
          onClose={() => null}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-purple-gray-900/80 fixed inset-0 opacity-100 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="min-w-[360px] !max-w-prose transform overflow-hidden rounded-md bg-pink-900 p-8 text-justify align-middle transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-white"
                  >
                    DISCLAIMER
                  </Dialog.Title>
                  <div className="mt-6">
                    <p className="mb-5 text-sm leading-6 text-slate-300">
                      Fortress Finance is a set of smart contracts made
                      available by Fortress.Finance on a voluntary, “as-is” and
                      “as available” basis. By interacting or attempting to
                      interact (in both cases, “interacting”) with Umami, you
                      confirm that you understand and agree to these terms:
                    </p>
                    <p className="mb-5 text-sm leading-6 text-slate-300">
                      Nature of Finance Fortress: The protocol is completely
                      decentralized, Fortress.Finance is not involved in any
                      transactions, whether as an intermediary, counterparty,
                      advisor or otherwise.
                    </p>
                    <p className="mb-5 text-sm leading-6 text-slate-300">
                      You are not a US Person; you are not a resident, national,
                      or agent of Antigua and Barbuda, Algeria, Bangladesh,
                      Bolivia, Belarus, Burundi, Burma (Myanmar), Cote D’Ivoire
                      (Ivory Coast), Crimea and Sevastopol, Cuba, Democratic
                      Republic of Congo, Ecuador, Iran, Iraq, Liberia, Libya,
                      Magnitsky, Mali, Morocco, Nepal, North Korea, Somalia,
                      Sudan, Syria, Venezuela, Yemen, Zimbabwe or any other
                      country to which the United States, the United Kingdom or
                      the European Union embargoes goods or imposes similar
                      sanctions; you are not a member of any sanctions list or
                      equivalent maintained by the United States government, the
                      United Kingdom government, the European Union, or the
                      United Nations; you do intend to transact with any
                      Restricted Person or Sanctions List Person; you do not,
                      and will not, use VPN software or any other privacy or
                      anonymization tools or techniques to circumvent, or
                      attempt to circumvent, any restrictions.
                    </p>
                  </div>

                  <div className="mt-4">
                    <Button
                      className="focus-visible:ring-blue-500 inline-flex w-full justify-center px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      I understand
                    </Button>
                  </div>

                  <div className="mt-2 text-center ">
                    <a
                      href="about:blank"
                      className="text-label text-sm text-slate-600 underline"
                    >
                      Leave site
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
