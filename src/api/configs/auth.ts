import { AuthConfig } from '@auth/core';
import { CredentialsSignin } from '@auth/express';
import CredentialsProvider from '@auth/express/providers/credentials';
import GitHub from '@auth/express/providers/github';
import Google from '@auth/express/providers/google';
import Sendgrid from '@auth/express/providers/sendgrid';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { env } from '../../env.js';
import { logger } from '../../utilities/logger.js';
import { bypassPrisma } from '../database/prisma/client.js';
import { UserRepository } from '../persistence/user/user.repository.js';
import { LoginUseCase } from '../useCases/auth/login.useCase.js';

const useSecureCookies = env.PUBLIC_SERVER_ORIGIN.startsWith('https://');
const hostName = env.SERVER_HOST;

// ref: https://authjs.dev/reference/express#credentialssignin
class InvalidLoginError extends CredentialsSignin {
  code = 'invalid_credentials';
}

export const authConfig: Omit<AuthConfig, 'raw'> = {
  trustHost: true,
  callbacks: {
    async jwt(params: any) {
      const { token, user } = params;
      if (!user) return token;
      token.user = user;

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
    GitHub({
      profile(profile) {
        return {
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatar_url, // todo remove later
          image: profile.avatar_url,
        };
      },
      // todo remove later
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      profile(profile) {
        return {
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.picture, // todo remove later
          image: profile.picture,
        };
      },
      // todo remove later
      allowDangerousEmailAccountLinking: true,
    }),
    Sendgrid({
      apiKey: env.EMAIL_SENDGRID_API_KEY,
      from: env.EMAIL_FROM,
    }),
    CredentialsProvider({
      id: 'login',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          const useCase = new LoginUseCase(bypassPrisma, new UserRepository());
          const me = await useCase.execute(email as string, password as string);
          return me;
        } catch (e) {
          logger.error(e);
          throw new InvalidLoginError();
        }
      },
    }),
  ],
  adapter: PrismaAdapter(bypassPrisma),
  session: {
    strategy: 'jwt',
  },
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
