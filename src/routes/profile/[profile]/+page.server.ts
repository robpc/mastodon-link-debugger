import type { PageServerLoad } from './$types';
import { parse } from 'node-html-parser';

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

  const text = await fetch(url).then((resp) => resp.text());
  const html = parse(text);
  const links = html.querySelectorAll(`a[href='${profileUrl}']`);

  const isHttps = url.startsWith('https://');
  const isBodyLessThanOneMegabyte = text.length < 1 * 1024 * 1024;
  const hasProfileLink = links.length > 0;
  const hasRelMeAttribute = links.some(({ attributes }) => attributes.rel === 'me');

  return {
    url,
    verified,
    isVerifiable: true,
    checklist: {
      isHttps,
      isBodyLessThanOneMegabyte,
      hasProfileLink,
      hasRelMeAttribute
    }
  };
};

export const load: PageServerLoad = async ({ params }) => {
  const { profile } = params;

  const [username, domain] = profile.replace(/^@?/, '').split('@', 2);
  const profileUrl = `https://${domain}/@${username}`;

  const resp = await fetch(`https://${domain}/api/v1/accounts/lookup/?acct=${username}`);
  const json: MastodonProfile = await resp.json();

  const { display_name: name } = json;

  const linkPromises = json.fields.map((field) => processField(field, profileUrl));
  const links = Promise.all(linkPromises);

  return {
    name,
    profile,
    links
  };
};
