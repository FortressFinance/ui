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
  rewrittenPathname: string,
  // eslint-disable-next-line
  query: Record<string, any>
) => {
  const newQuery = minObject(query)
  return {
    href: { pathname, query: newQuery },
    as: { pathname: rewrittenPathname, query: newQuery },
  }
}
