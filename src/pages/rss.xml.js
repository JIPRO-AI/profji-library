import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const articles = await getCollection('articles');
	const sorted = articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: new URL('/profji-library/', context.site).href,
		items: sorted.map((article) => ({
			title: article.data.title,
			description: article.data.description,
			pubDate: article.data.pubDate,
			categories: [article.data.category],
			link: `/profji-library/articles/${article.id}/`,
		})),
		customData: '<language>ko</language>',
	});
}
