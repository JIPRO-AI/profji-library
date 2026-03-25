const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

async function incrementView(slug: string): Promise<number | null> {
	try {
		const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_view`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'apikey': SUPABASE_ANON_KEY,
				'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
			},
			body: JSON.stringify({ page_slug: slug }),
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}

async function getViewCount(slug: string): Promise<number> {
	try {
		const res = await fetch(
			`${SUPABASE_URL}/rest/v1/page_views?slug=eq.${encodeURIComponent(slug)}&select=count`,
			{
				headers: {
					'apikey': SUPABASE_ANON_KEY,
					'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
				},
			}
		);
		if (!res.ok) return 0;
		const data = await res.json();
		return data.length > 0 ? data[0].count : 0;
	} catch {
		return 0;
	}
}

function initViewCounters() {
	document.querySelectorAll('.view-counter').forEach(async (el) => {
		const slug = (el as HTMLElement).dataset.slug || '';
		const shouldIncrement = (el as HTMLElement).dataset.increment === 'true';
		const countEl = el.querySelector('.view-count');
		if (!countEl || !slug) return;

		if (shouldIncrement) {
			const sessionKey = `jrl_viewed_${slug}`;
			if (!sessionStorage.getItem(sessionKey)) {
				const newCount = await incrementView(slug);
				if (newCount !== null) {
					sessionStorage.setItem(sessionKey, '1');
					countEl.textContent = String(newCount);
					return;
				}
			}
		}

		const count = await getViewCount(slug);
		countEl.textContent = count > 0 ? String(count) : '—';
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initViewCounters);
} else {
	initViewCounters();
}
document.addEventListener('astro:page-load', initViewCounters);
