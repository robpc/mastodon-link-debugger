import type { PageServerLoad } from './$types';
import { parse } from 'node-html-parser';

export const prerender = false;

const ONE_MEGABYTE = 1 * 1024 * 1024;

const processField = async (
  { value, verified_at: verified }: MastodonField,
  profileUrl: string
): Promise<LinkCheck> => {
  const url = value.replace(/^<a href=\"/, '').replace(/\".*/, '');

  if (!url.startsWith('http')) {
    return {
      url,
      verified,
      isVerifiable: false,
      allPassed: false,
      checklist: undefined
    };
  }

  const isHttps = url.startsWith('https://');
  let isLessThanFiveSeconds = false;

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 8000);

    const startTime = process.hrtime();
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'http.rb/2.2.2 (Mastodon/4.0.2; +mastodon-link-debugger.vercel.app/)'
      }
    });
    const diffTime = process.hrtime(startTime);
    const elapsedTime = diffTime[0] + diffTime[1] / 1e9;

    isLessThanFiveSeconds = resp.ok && elapsedTime < 5;

    console.log(url, elapsedTime, controller.signal.aborted, resp.ok);

    const text = await resp.text();

    const html = parse(text);
    const links = html.querySelectorAll(`a[href='${profileUrl}']`);

    const isBodyLessThanOneMegabyte = text.length < ONE_MEGABYTE;
    const hasProfileLink = links.length > 0;
    const hasRelMeAttribute = hasProfileLink
      ? links.some(({ attributes }) => attributes.rel === 'me')
      : null;

    const checklist: Checklist = {
      isHttps,
      isLessThanFiveSeconds,
      isBodyLessThanOneMegabyte,
      hasProfileLink,
      hasRelMeAttribute
    };

    const allPassed = !Object.values(checklist).some((v) => v !== true);

    return {
      url,
      verified,
      isVerifiable: true,
      allPassed,
      checklist
    };
  } catch (err) {}

  return {
    url,
    verified,
    isVerifiable: true,
    allPassed: false,
    checklist: {
      isHttps,
      isLessThanFiveSeconds,
      isBodyLessThanOneMegabyte: null,
      hasProfileLink: null,
      hasRelMeAttribute: null
    }
  };
};

export const load: PageServerLoad = async ({ params }) => {
  const { profile } = params;

  const [username, domain] = profile.replace(/^@?/, '').split('@', 2);
  const profileUrl = `https://${domain}/@${username}`;

  try {
    const resp = await fetch(`https://${domain}/api/v1/accounts/lookup/?acct=${username}`);
    const json: MastodonProfile = await resp.json();

    const { display_name: name } = json;

    const linkPromises = json.fields.map((field) => processField(field, profileUrl));
    const links = await Promise.all(linkPromises);

    return {
      name,
      profile,
      links
    };
  } catch (err) {
    console.log('Error:', err);
    return {
      name: 'Unable to load profile',
      profile,
      links: []
    };
  }
};
