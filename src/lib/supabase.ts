// Shared Supabase config — imported from env vars, not hardcoded
export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export function supabaseHeaders() {
	return {
		'apikey': SUPABASE_ANON_KEY,
		'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
	};
}
