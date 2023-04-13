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
  const rewrittenPathname =
    process.env.VERCEL_ENV !== "preview"
      ? pathname.replace("/app", "")
      : pathname
  return {
    href: { pathname, query: newQuery },
    as: { pathname: rewrittenPathname, query: newQuery },
  }
}

export const resolvedRoute = (pathname: string) => {
  const rewrittenPathname =
    process.env.VERCEL_ENV !== "preview"
      ? pathname.replace("/app", "")
      : pathname
  return {
    href: { pathname },
    as: { pathname: rewrittenPathname },
  }
}
