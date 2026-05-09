import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
	loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
		score: z.number().optional(),
		featured: z.boolean().default(false),
		articleType: z.enum(['research synthesis', 'framework', 'essay', 'analysis', 'case study']).default('essay'),
		titleEn: z.string().optional(),
		descriptionEn: z.string().optional(),
	}),
});

const novels = defineCollection({
	loader: glob({ base: './src/content/novels', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		series: z.string(),
		episode: z.number(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
	}),
});

const articlesEn = defineCollection({
	loader: glob({ base: './src/content/articles-en', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
		articleType: z.enum(['research synthesis', 'framework', 'essay', 'analysis', 'case study']).default('essay'),
		originalSlug: z.string(),   // Korean original slug
	}),
});

// 지교수 일지 — daily/weekly/monthly learning reports
const learningLog = defineCollection({
	loader: glob({ base: './src/content/learning-log', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		reportType: z.enum(['daily', 'weekly', 'monthly', 'meta']).default('daily'),
		summary: z.string().optional(),    // 1-2 line preview for list page
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { articles, novels, articlesEn, learningLog };
