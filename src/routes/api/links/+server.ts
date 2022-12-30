import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parse } from 'node-html-parser';

const headers = { 'Cache-Control': 'max-age=30, public' };

export const GET: RequestHandler = async ({ url }) => {
  const link = url.searchParams.get('link');
  const linkBack = url.searchParams.get('linkBack');

  if (!link) {
    throw error(400, `'link' parameter is missing`);
  }

  if (!linkBack) {
    throw error(400, `'linkBack' parameter is missing`);
  }

  if (!link.startsWith('http')) {
    return json(
      {
        url: link,
        isLink: false
      },
      { headers }
    );
  }

  const isHttps = link.startsWith('https://');
  let elapsedTime = null;

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 8000);

    const startTime = process.hrtime();
    const resp = await fetch(link, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'http.rb/2.2.2 (Mastodon/4.0.2; +mastodon-link-debugger.vercel.app/)'
      }
    });
    const diffTime = process.hrtime(startTime);
    elapsedTime = diffTime[0] + diffTime[1] / 1e9;

    console.log(link, elapsedTime, controller.signal.aborted, resp.ok);

    const text = await resp.text();

    const html = parse(text);
    const links = html
      .querySelectorAll(`a[href='${linkBack}']`)
      .map(({ attributes }) => ({ href: attributes.href, rel: attributes.rel }));

    const bodySize = text.length;

    return json(
      {
        url: link,
        isLink: true,
        isVerifiable: true,
        isHttps,
        elapsedTime,
        bodySize,
        links
      },
      { headers }
    );
  } catch (err) {}

  return json(
    {
      url: link,
      isLink: true,
      isVerifiable: true,
      isHttps,
      elapsedTime,
      bodySize: null,
      links: null
    },
    { headers }
  );
};
