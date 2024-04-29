import { AuthConfig } from '@auth/core';
import CredentialsProvider from '@auth/express/providers/credentials';
import { logger } from '../../utilities/logger.js';
import { MeRepository } from '../data/user/me.repository.js';
import { prisma } from '../database/prisma/client.js';
import { env } from '../../env.js';

const useSecureCookies = env.PUBLIC_SERVER_URL.startsWith('https://');
const hostName = new URL(env.PUBLIC_SERVER_URL).hostname;

export const authConfig: Omit<AuthConfig, 'raw'> = {
  callbacks: {
    jwt(params: any) {
      const { token, user } = params;
      if (user) {
        token.user = user;
      }

      return token;
    },
    session(params: any) {
      const { session, token } = params;
      if (token.user) {
        session.user = token.user;
      }

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          const repository = new MeRepository();
          const user = await repository.login(prisma, String(email), String(password));
          return user;
        } catch (e) {
          logger.error(e);
        }

        return null;
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: `.${hostName}`,
        secure: useSecureCookies,
      },
    },
  },
};
