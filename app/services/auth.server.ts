import { Authenticator, GitHubStrategy } from 'remix-auth';
import { sessionStorage } from '~/services/session.server';

type User = {
  id: string;
  email: string;
};

export let authenticator = new Authenticator<User>(sessionStorage);

if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error('Missing GITHUB_CLIENT_ID env');
}

if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('Missing GITHUB_CLIENT_SECRET env');
}

if (!process.env.GITHUB_CALLBACK_URL) {
  throw new Error('Missing GITHUB_CALLBACK_URL env');
}

authenticator.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (_, __, ___, profile) => ({
      id: profile.id,
      email: profile._json.email,
    })
  )
);
