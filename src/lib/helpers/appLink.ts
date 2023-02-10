export function appLink(path: string) {
  if (
    typeof window !== "undefined" &&
    window.location.pathname.includes("/app")
  ) {
    const newPath = path === "/" ? "/yield" : path
    return `/app/${newPath}`
  }
  return path
}
