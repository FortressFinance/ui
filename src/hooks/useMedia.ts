import { useMediaQuery } from "react-responsive"

export function useMedia(query: string) {
  const isMatch = useMediaQuery({ query })
  return isMatch
}
