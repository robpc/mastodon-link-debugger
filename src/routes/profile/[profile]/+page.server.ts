import type { PageServerLoad } from './$types';
import { parse } from 'node-html-parser';

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
      checklist: undefined
    };
  }

  const startTime = process.hrtime();
  const resp = await fetch(url);
  const diffTime = process.hrtime(startTime);
  const elapsedTime = diffTime[0] + diffTime[1] / 1e9;
  console.log('elapsedTime', elapsedTime, diffTime, url);

  const text = await resp.text();

  const html = parse(text);
  const links = html.querySelectorAll(`a[href='${profileUrl}']`);

  const isHttps = url.startsWith('https://');
  const isLessThanFiveSeconds = elapsedTime < 5;
  const isBodyLessThanOneMegabyte = text.length < ONE_MEGABYTE;
  const hasProfileLink = links.length > 0;
  const hasRelMeAttribute = links.some(({ attributes }) => attributes.rel === 'me');

  return {
    url,
    verified,
    isVerifiable: true,
    checklist: {
      isHttps,
      isLessThanFiveSeconds,
      isBodyLessThanOneMegabyte,
      hasProfileLink,
      hasRelMeAttribute
    }
  };
};

export const load: PageServerLoad = async ({ params }) => {
  const { profile } = params;
  console.time(`load ${profile}`);

  const [username, domain] = profile.replace(/^@?/, '').split('@', 2);
  const profileUrl = `https://${domain}/@${username}`;

  const resp = await fetch(`https://${domain}/api/v1/accounts/lookup/?acct=${username}`);
  const json: MastodonProfile = await resp.json();

  const { display_name: name } = json;

  const linkPromises = json.fields.map((field) => processField(field, profileUrl));
  const links = await Promise.all(linkPromises);

  console.timeEnd(`load ${profile}`);

  return {
    name,
    profile,
    links
  };
};
