import { navigatorLock } from "@supabase/auth-js"
import { createClient } from "@supabase/supabase-js"
import config from "../config"

export const supabase = createClient(config.supabase.url, config.supabase.publicKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Prevent cross-app collisions on the same domain/origin
    storageKey: "trey-jippo-auth",
    lock: navigatorLock,
  },
})
