import { createClient } from "@supabase/supabase-js";


const supabaseUrl = "https://cbiuwpnldfgdzojxzbww.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiaXV3cG5sZGZnZHpvanh6Ynd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzOTUxNjgsImV4cCI6MjA3Nzk3MTE2OH0.BVlrAUriDdnsdSqM7_dtgASp4HAbLzB1tZqGsO5nwZU";

export const supabase = createClient(supabaseUrl, supabaseKey);
