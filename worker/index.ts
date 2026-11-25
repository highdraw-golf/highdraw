/**
 * High Draw Golf — Cloudflare Workers + Static Assets Edge Entrypoint
 *
 * Eliminates Vercel serverless invocation & bandwidth limits while keeping
 * `/api/stripe`, `/api/printify`, `/api/marketing`, and `/api/og` 100% shared
 * between Vercel and Cloudflare Workers.
 *
 * Deployment:
 *   1. npx wrangler secret put STRIPE_SECRET_KEY
 *   2. npx wrangler secret put PRINTIFY_API_TOKEN
 *   3. npm run cf:deploy
 */

import stripeHandler from '../api/stripe.ts';
import printifyHandler from '../api/printify.ts';
import marketingHandler from '../api/marketing.ts';
import ogHandler from '../api/og.ts';

export interface WorkerEnv {
  ASSETS: {
    fetch(request: Request | string): Promise<Response>;
  };
  STRIPE_SECRET_KEY?: string;
  PRINTIFY_API_TOKEN?: string;
  PRINTIFY_SHOP_ID?: string;
  OWNER_PIN_HASH?: string;
}

const CRAWLER_UA_RE =
  /facebookexternalhit|Facebot|meta-externalagent|Twitterbot|WhatsApp|LinkedInBot|Slackbot|Discordbot|TelegramBot|Pinterest|Applebot|iMessageLinkPreviews/i;

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://images.printify.com https://images-api.printify.com https://www.facebook.com; connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://*.firebaseio.com https://*.googleapis.com https://www.facebook.com https://connect.facebook.net; frame-src https://js.stripe.com https://checkout.stripe.com; object-src 'none'; base-uri 'self';",
};

function syncWorkerSecretsToProcessEnv(env: WorkerEnv): void {
  if (typeof process === 'undefined' || !process.env) return;
  if (env.STRIPE_SECRET_KEY) process.env.STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
  if (env.PRINTIFY_API_TOKEN) process.env.PRINTIFY_API_TOKEN = env.PRINTIFY_API_TOKEN;
  if (env.PRINTIFY_SHOP_ID) process.env.PRINTIFY_SHOP_ID = env.PRINTIFY_SHOP_ID;
  if (env.OWNER_PIN_HASH) process.env.OWNER_PIN_HASH = env.OWNER_PIN_HASH;
}

async function adaptNodeApiHandler(
  request: Request,
  url: URL,
  handler: (req: any, res: any) => Promise<unknown> | unknown,
  extraQuery?: Record<string, string>
): Promise<Response> {
  const headersObj: Record<string, string> = {};
  request.headers.forEach((val, key) => {
    headersObj[key.toLowerCase()] = val;
  });

  const queryObj: Record<string, string> = {};
  url.searchParams.forEach((val, key) => {
    queryObj[key] = val;
  });
  if (extraQuery) {
    Object.assign(queryObj, extraQuery);
  }

  let parsedBody: unknown = undefined;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const contentType = headersObj['content-type'] || '';
    const rawText = await request.text();
    if (rawText) {
      if (contentType.includes('application/json')) {
        try {
          parsedBody = JSON.parse(rawText);
        } catch {
          parsedBody = rawText;
        }
      } else {
        parsedBody = rawText;
      }
    }
  }

  let statusCode = 200;
  const resHeaders = new Headers();
  let responseBody = '';

  const mockRes = {
    setHeader(name: string, value: string) {
      resHeaders.set(name, value);
      return mockRes;
    },
    status(code: number) {
      statusCode = code;
      return mockRes;
    },
    json(payload: unknown) {
      if (!resHeaders.has('Content-Type')) {
        resHeaders.set('Content-Type', 'application/json; charset=utf-8');
      }
      responseBody = JSON.stringify(payload);
      return mockRes;
    },
    send(body: string) {
      responseBody = body;
      return mockRes;
    },
    end(body?: string) {
      if (typeof body === 'string') responseBody = body;
      return mockRes;
    },
  };

  const mockReq = {
    method: request.method,
    headers: headersObj,
    query: queryObj,
    body: parsedBody,
    url: `${url.pathname}${url.search}`,
  };

  await handler(mockReq, mockRes);

  return new Response(request.method === 'HEAD' ? null : responseBody, {
    status: statusCode,
    headers: resHeaders,
  });
}

function withSecurityHeaders(res: Response): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    syncWorkerSecretsToProcessEnv(env);
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';

    // 1. Serverless API Routes
    if (pathname === '/api/stripe') {
      return adaptNodeApiHandler(request, url, stripeHandler);
    }
    if (pathname === '/api/printify') {
      return adaptNodeApiHandler(request, url, printifyHandler);
    }
    if (pathname === '/api/marketing') {
      return adaptNodeApiHandler(request, url, marketingHandler);
    }
    if (pathname === '/api/og') {
      return adaptNodeApiHandler(request, url, ogHandler);
    }

    // 2. Social Crawler Dynamic Open Graph Metadata on Deep Links
    const ua = request.headers.get('user-agent') || '';
    if (
      CRAWLER_UA_RE.test(ua) &&
      (pathname.startsWith('/products/') ||
        pathname.startsWith('/collections/') ||
        pathname.startsWith('/pages/') ||
        pathname === '/semi')
    ) {
      return adaptNodeApiHandler(request, url, ogHandler, { path: pathname });
    }

    // 3. Static Prerendered HTML & SPA Assets via Cloudflare Workers Assets Binding
    const assetRes = await env.ASSETS.fetch(request);
    return withSecurityHeaders(assetRes);
  },
};
