/* eslint-disable @typescript-eslint/no-explicit-any */

// Removes undefined values from an object
const minObject = (obj: Record<string, any>) => {
  const cloned = { ...obj }
  Object.keys(cloned).forEach(
    (key) => cloned[key] === undefined && delete cloned[key]
  )
  return cloned
}

// Returns a route object for use with Next.js Link or Router.push
export const resolvedRoute = (
  pathname: string,
  query: Record<string, any> = {}
) => {
  const newQuery = minObject(query)
  return {
    href: { pathname, query: newQuery },
    as:
      process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
        ? undefined
        : { pathname: pathname.replace("/app", ""), query: newQuery },
  }
}
