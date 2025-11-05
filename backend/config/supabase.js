import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wyjhzpazssggwuoqcuom.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5amh6cGF6c3NnZ3d1b3FjdW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTkwOTUsImV4cCI6MjA3NzczNTA5NX0.XHiStGpo4POZ37IvBeolppHB3AZ8tjceZcIQqDmkHxQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
