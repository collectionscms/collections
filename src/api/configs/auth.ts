import { AuthConfig } from '@auth/core';
import { CredentialsSignin } from '@auth/express';
import CredentialsProvider from '@auth/express/providers/credentials';
import GitHub from '@auth/express/providers/github';
import Google from '@auth/express/providers/google';
import { env } from '../../env.js';
import { logger } from '../../utilities/logger.js';
import { bypassPrisma } from '../database/prisma/client.js';
import { AuthProvider } from '../persistence/user/user.entity.js';
import { UserRepository } from '../persistence/user/user.repository.js';
import { LoginUseCase } from '../useCases/auth/login.useCase.js';
import { OAuthSignInUseCase } from '../useCases/auth/oAuthSignIn.useCase.js';
import { oAuthSingInUseCaseSchema } from '../useCases/auth/oAuthSignIn.useCase.schema.js';

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

      if (user.provider !== AuthProvider.email) {
        // OAuth
        const validated = oAuthSingInUseCaseSchema.safeParse(user);
        if (validated.success) {
          const useCase = new OAuthSignInUseCase(bypassPrisma, new UserRepository());
          token.user = await useCase.execute(validated.data);
        } else {
          logger.error(validated.error);
          throw new InvalidLoginError();
        }
      } else {
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
    GitHub({
      profile(profile) {
        return {
          email: profile.email,
          name: profile.name,
          image: profile.avatar_url,
          provider: 'github',
          providerId: profile.id.toString(),
        };
      },
    }),
    Google({
      profile(profile) {
        return {
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          provider: 'google',
          providerId: profile.sub,
        };
      },
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
