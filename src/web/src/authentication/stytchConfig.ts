import { StytchLoginConfig, Products } from "@stytch/vanilla-js"

export const SESSION_DURATION_MINUTES = 60

export const STYTCH_CONFIG: StytchLoginConfig = {
  products: [Products.passwords],
  sessionOptions: {
    sessionDurationMinutes: SESSION_DURATION_MINUTES,
  },
  passwordOptions: {
    loginExpirationMinutes: 30,
    loginRedirectURL: `${window.location.origin}/authenticate`,
    resetPasswordExpirationMinutes: 30,
    resetPasswordRedirectURL: `${window.location.origin}/reset-password`,
  },
}
