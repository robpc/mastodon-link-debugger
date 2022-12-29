import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const profile = data.get('profile') as string;

    if (!profile) {
      return fail(404, { profile, empty: true });
    }

    const httpRex = /https?\:\/\/.+\/@.+/;
    const usernameRex = /@.+@.+/;
    if (httpRex.test(profile)) {
      const [domain, username] = profile.replace(/https?\:\/\//, '').split('/', 2);

      throw redirect(303, `./profile/${username}@${domain}`);
    }

    if (usernameRex.test(profile)) {
      throw redirect(303, `./profile/${profile.trim()}`);
    }

    return fail(400, { profile, invalid: true });
  }
};
