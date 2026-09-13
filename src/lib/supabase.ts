import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mqibouktqoqaiszjfvhw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_65MuqVA5tPxQRBB9df8pnA_ELAenxK3';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'));
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface ConnectionHealth {
  ok: boolean;
  latencyMs: number;
  message: string;
}

export const checkSupabaseHealth = async (): Promise<ConnectionHealth> => {
  const start = performance.now();
  try {
    // Ping Supabase auth health or vehicles table
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        apikey: supabaseAnonKey,
      },
    });

    const latencyMs = Math.round(performance.now() - start);

    if (res.ok) {
      return {
        ok: true,
        latencyMs,
        message: 'Connected to Supabase Gateway',
      };
    }

    return {
      ok: false,
      latencyMs,
      message: `Supabase returned HTTP ${res.status}`,
    };
  } catch (err: any) {
    return {
      ok: false,
      latencyMs: Math.round(performance.now() - start),
      message: err?.message || 'Failed to reach Supabase',
    };
  }
};
