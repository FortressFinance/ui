import { Dialog, Transition } from "@headlessui/react"
import { FC, Fragment, useState } from "react"

export const Consent: FC = () => {
  const [isOpen, setIsOpen] = useState(true)

  function closeModal() {    
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open dialog
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    DISCLAIMER
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Fortress Finance is a set of smart contracts made available by Fortress.Finance on a voluntary, “as-is” and “as available” basis. By interacting or attempting to interact (in both cases, “interacting”) with Umami, you confirm that you understand and agree to these terms:
                    </p>
                    <p className="text-sm text-gray-500">
                      Nature of Finance Fortress: The protocol is completely decentralized, Fortress.Finance is not involved in any transactions, whether as an intermediary, counterparty, advisor or otherwise.
                    </p>
                    <p className="text-sm text-gray-500">
                      You are not a US Person; you are not a resident, national, or agent of Antigua and Barbuda, Algeria, Bangladesh, Bolivia, Belarus, Burundi, Burma (Myanmar), Cote D’Ivoire (Ivory Coast), Crimea and Sevastopol, Cuba, Democratic Republic of Congo, Ecuador, Iran, Iraq, Liberia, Libya, Magnitsky, Mali, Morocco, Nepal, North Korea, Somalia, Sudan, Syria, Venezuela, Yemen, Zimbabwe or any other country to which the United States, the United Kingdom or the European Union embargoes goods or imposes similar sanctions; you are not a member of any sanctions list or equivalent maintained by the United States government, the United Kingdom government, the European Union, or the United Nations; you do intend to transact with any Restricted Person or Sanctions List Person; you do not, and will not, use VPN software or any other privacy or anonymization tools or techniques to circumvent, or attempt to circumvent, any restrictions.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
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
