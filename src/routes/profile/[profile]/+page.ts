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
        let isSuccessful = false;
        let isLessThanFiveSeconds = false;

        try {
          const resp = await fetch(`/api/links?link=${url}&linkBack=${profileUrl}`);
          const linkMeta = await resp.json();

          // This inturpretation is taken from
          // https://github.com/mastodon/mastodon/blob/0c689b9d014324aba5b8751dacec4c0fc20b2038/app/services/verify_link_service.rb#L22
          isSuccessful = linkMeta.statusCode === 200;

          // If not successful, this could be an error page
          // and therefore makes the other tests misleading
          if (!isSuccessful) {
            return {
              url,
              verified,
              isVerifiable: true,
              allPassed: false,
              checklist: {
                isHttps,
                isSuccessful,
                isLessThanFiveSeconds: null,
                isBodyLessThanOneMegabyte: null,
                hasProfileLink: null,
                hasRelMeAttribute: null
              }
            };
          }

          isLessThanFiveSeconds = resp.ok && linkMeta.elapsedTime < 5;

          if (isSuccessful && isLessThanFiveSeconds) {
            const isBodyLessThanOneMegabyte = linkMeta.bodySize < ONE_MEGABYTE;
            const hasProfileLink = linkMeta.links && linkMeta.links.length > 0;
            const hasRelMeAttribute = hasProfileLink
              ? linkMeta.links.some(({ rel }: { rel: string }) => rel.includes('me'))
              : null;

            const checklist: Checklist = {
              isHttps,
              isSuccessful,
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
          }
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
            isSuccessful,
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
