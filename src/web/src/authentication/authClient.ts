import { createClient } from "@supabase/supabase-js"
import config from "../config"

export const supabase = createClient(config.supabase.url, config.supabase.key)

export const getSession = async () => {
  const session = await supabase.auth.getSession()
  return session.data.session
}
