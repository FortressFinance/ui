// eslint-disable-next-line
const minObject = (obj: Record<string, any>) => {
  const cloned = { ...obj }
  Object.keys(cloned).forEach(
    (key) => cloned[key] === undefined && delete cloned[key]
  )
  return cloned
}

export const shallowRoute = (
  pathname: string,
  // eslint-disable-next-line
  query: Record<string, any>
) => {
  const newQuery = minObject(query)
  return {
    href: { pathname, query: newQuery },
    as:
      process.env.VERCEL_ENV === "preview"
        ? undefined
        : { pathname: pathname.replace("/app", ""), query: newQuery },
  }
}

export const resolvedRoute = (pathname: string) => {
  return {
    href: { pathname },
    as:
      process.env.VERCEL_ENV === "preview"
        ? undefined
        : { pathname: pathname.replace("/app", "") },
  }
}
