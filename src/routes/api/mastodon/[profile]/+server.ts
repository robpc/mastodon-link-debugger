import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const { profile } = params;

  const [username, domain] = profile.replace(/^@?/, '').split('@', 2);
  const profileUrl = `https://${domain}/api/v1/accounts/lookup/?acct=${username}`;

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    const resp = await fetch(profileUrl, { signal: controller.signal });

    if (!resp.ok) {
      throw error(resp.status);
    }

    const mastodon: MastodonProfile = await resp.json();

    return json(mastodon, { headers: { 'cache-control': 'max-age=30, public' } });
  } catch (err: any) {
    console.log(profileUrl, err);
    throw error(500, err.message);
  }
};
