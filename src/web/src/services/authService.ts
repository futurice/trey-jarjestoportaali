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
    throw new Error("Failed to authorize user")
  }

  return await response.json()
}
