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

export const collections = { articles, novels };
