import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * /robots.txt — it returned 404.
 *
 * Everything on this site is meant to be read, so everything is allowed. The
 * one exception is /api, which holds a single POST endpoint for the contact
 * form: there is nothing there for a crawler to read and a crawled GET on it
 * is a request that can only fail.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
