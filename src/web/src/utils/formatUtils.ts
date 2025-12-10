export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const maxIndex = sizes.length - 1
  const displayIndex = Math.min(i, maxIndex)

  return `${Number.parseFloat((bytes / Math.pow(k, displayIndex)).toFixed(2))} ${sizes[displayIndex]}`
}

export function formatDate(date?: Date): string {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}
