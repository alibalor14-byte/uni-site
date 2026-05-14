import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iuzzhzeoepjsfhtfmqrv.supabase.co'
const supabaseAnonKey = 'sb_publishable_ImwmaC_ZFsnYbNW81I0jmw_fqQDc8sb'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);