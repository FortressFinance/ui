import * as Dialog from "@radix-ui/react-dialog"
import { FC } from "react"

import Button from "@/components/Button"
import { ModalBaseProps } from "@/components/Modal/lib/ModalBase"
import PurpleModal, {
  PurpleModalContent,
  PurpleModalHeader,
} from "@/components/Modal/lib/PurpleModal"

import { FortIconCloseCircle } from "@/icons"

type InvalidMinAmountModalProps = ModalBaseProps & {
  type: "deposit" | "withdraw"
}

export const InvalidMinAmountModal: FC<InvalidMinAmountModalProps> = ({
  type,
  ...modalProps
}) => {
  return (
    <PurpleModal className="max-w-sm" {...modalProps}>
      <PurpleModalHeader className="flex justify-between space-x-4">
        <Dialog.Title className="text-xl">Unable to {type}</Dialog.Title>
        <Dialog.Close>
          <FortIconCloseCircle className="h-7 w-7" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </PurpleModalHeader>

      <PurpleModalContent className="grid grid-cols-1 space-y-4 divide-pink-800">
        <div>
          <p className="mb-2">
            We're unable to preview your {type} transaction right now. Please
            try again later.
          </p>
          <p className="text-sm">
            Without a successful {type} preview, we're unable to honor your
            slippage preferences through the UI. To protect you from losses, we
            will not allow you to {type} without a minimum amount.
          </p>
        </div>
        <Button variant="plain" onClick={modalProps.onClose}>
          Go back
        </Button>
      </PurpleModalContent>
    </PurpleModal>
  )
}
