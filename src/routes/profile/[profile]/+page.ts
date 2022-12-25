import type { PageLoad } from './$types';

type LinkCheck = {
  url: string;
  verified: string;
  checklist: {
    isHttps: boolean;
    isBodyLessThanOneMegabyte: boolean;
    hasProfileLink: boolean;
    hasRelMeAttribute: boolean;
  };
};

type MastodonProfile = {
  display_name: string;
  fields: {
    name: string;
    value: string;
    verified_at: string;
  }[];
};

export const load: PageLoad = async ({ params }) => {
  const { profile } = params;

  const [username, domain] = profile.replace(/^@?/, '').split('@', 2);

  const resp = await fetch(`https://${domain}/api/v1/accounts/lookup/?acct=${username}`);
  const json: MastodonProfile = await resp.json();

  // isVerified
  // Url is https?
  // Url body is less than 1mb?
  // Url contains link to profile?
  // Url contains link to profile with rel?

  const { display_name: name } = json;

  const links = json.fields
    .filter(({ name }) => name === 'website')
    .map(({ value, verified_at: verified }) => {
      const url = value.replace(/^<a href=\"/, '').replace(/\".*/, '');

      return { url, verified };
    });

  return {
    name,
    profile,
    links
  };
};
