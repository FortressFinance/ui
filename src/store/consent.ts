import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ConsentState {
  consent: boolean
  understandDisclaimer: () => void
  resetConsent: () => void
}

const useConsentStorage = create<ConsentState>()(
  persist(
    (set) => ({
      consent: false,
      understandDisclaimer: () => set(() => ({ consent: true })),
      resetConsent: () => set(() => ({ consent: false })),
    }),
    { name: "consent-storage" }
  )
)

export default useConsentStorage
