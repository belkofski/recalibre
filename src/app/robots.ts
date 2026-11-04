import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * /robots.txt — it returned 404.
 *
 * Everything on this site is meant to be read, so everything is allowed. The
 * one exception is /api, which holds a single POST endpoint for the contact
 * form: there is nothing there for a crawler to read and a crawled GET on it
 * is a request that can only fail.
 *
 * THE AI CRAWLERS ARE NAMED (4 November 2026). The wildcard already allowed
 * them; naming them says so on purpose, which is what a crawler operator
 * reads when deciding whether a site wants to be found by an answer
 * engine. The audit of 3 November 2026 marked robots.txt NOT A DEFECT; this
 * adds to it and changes nothing it did. /llms.txt beside it says what
 * the site is for a model that reads it.
 */
const AI_AGENTS = ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'anthropic-ai', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider', 'Amazonbot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow: '/api/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
