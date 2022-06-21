import { createClient } from '@supabase/supabase-js'

const supabaseUrl = `https://cszgwlefltygxrmdboqa.supabase.co`
const supabaseAnonKey =
    import.meta.env['VITE_SUPABASE_ANON_KEY']

export default createClient(supabaseUrl, supabaseAnonKey)