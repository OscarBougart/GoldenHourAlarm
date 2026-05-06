import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

// Stub — set SUPABASE_URL and SUPABASE_ANON_KEY in .env and wire them via app.config.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
