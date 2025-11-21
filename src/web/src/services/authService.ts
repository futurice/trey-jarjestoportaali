import config from "../config"

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
    throw new Error(`Failed to authorize user: HTTP ${response.status} - ${errorDetails}`)
  }

  return await response.json()
}
