import { AuthConfig } from '@auth/core';
import CredentialsProvider from '@auth/express/providers/credentials';
import { env } from '../../env.js';
import { logger } from '../../utilities/logger.js';
import { UserRepository } from '../persistence/user/user.repository.js';
import { bypassPrisma } from '../database/prisma/client.js';
import { LoginUseCase } from '../useCases/auth/login.useCase.js';
import { CredentialsSignin } from '@auth/express';

const useSecureCookies = env.PUBLIC_SERVER_ORIGIN.startsWith('https://');
const hostName = env.SERVER_HOST;

// ref: https://authjs.dev/reference/express#credentialssignin
class InvalidLoginError extends CredentialsSignin {
  code = 'invalid_credentials';
}

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
