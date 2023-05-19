export function formatDate(
  date: Date,
  dateStyle?: "full" | "medium" | "long" | "short",
  timeStyle?: "full" | "medium" | "long" | "short"
) {
  const longEnUSFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: dateStyle,
    timeStyle: timeStyle,
  })
  return longEnUSFormatter.format(date)
}
