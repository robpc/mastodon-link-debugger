import type { PageLoad } from './$types';

const ONE_MEGABYTE = 1 * 1024 * 1024;

export const load: PageLoad = async ({ fetch, params, setHeaders }) => {
  const { profile } = params;

  setHeaders({
    'cache-control': 'max-age=15, public'
  });

  const [username, domain] = profile.replace(/^@?/, '').split('@', 2);
  const profileUrl = `https://${domain}/@${username}`;

  try {
    const resp = await fetch(`/api/mastodon/${profile}`);
    const json: MastodonProfile = await resp.json();

    const { display_name: name } = json;

    const linkPromises = json.fields.map(
      async ({ value, verified_at: verified }: MastodonField) => {
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
          const resp = await fetch(`/api/links?link=${url}&linkBack=${profileUrl}`);
          const linkMeta = await resp.json();

          isLessThanFiveSeconds = resp.ok && linkMeta.elapsedTime < 5;

          const isBodyLessThanOneMegabyte = linkMeta.bodySize < ONE_MEGABYTE;
          const hasProfileLink = linkMeta.links && linkMeta.links.length > 0;
          const hasRelMeAttribute = hasProfileLink
            ? linkMeta.links.some(({ rel }) => rel.includes('me'))
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
        } catch (err) {
          console.log('ERROR - /profile:', url, err);
        }

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
      }
    );
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
