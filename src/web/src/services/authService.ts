import config from "../config"

export type AuthResponseError = Error & {
  status: number
  info: string
}

export const authorizeUser = async (username: string, password: string) => {
  const response = await fetch(`${config.api.baseUrl}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    let errorDetails = ""
    try {
      errorDetails = await response.text()
    } catch {
      errorDetails = response.statusText
    }
    const error = new Error(
      `Failed to authorize user: HTTP ${response.status} - ${errorDetails}`,
    ) as AuthResponseError
    error.status = response.status
    error.info = errorDetails
    throw error
  }

  return await response.json()
}
