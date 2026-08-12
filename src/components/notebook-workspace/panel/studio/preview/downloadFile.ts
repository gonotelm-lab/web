import i18n from '@/i18n'

export async function downloadFileFromUrl(url: string, filename: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(i18n.t('studio:download.failed', { status: response.status }))
  }
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}
