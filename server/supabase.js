import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://YOUR_URL.supabase.co"
const supabaseKey = "YOUR_KEY"

export const supabase = createClient(supabaseUrl, supabaseKey)