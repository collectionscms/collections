import CredentialsProvider from '@auth/express/providers/credentials';
import { logger } from '../../utilities/logger.js';
import { prisma } from '../database/prisma/client.js';
import { UserService } from '../services/user.js';

export const authConfig = {
  callbacks: {
    async jwt(params: any) {
      const { token, user } = params;
      if (user) {
        token.user = user;
      }

      return token;
    },
    async session(params: any) {
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
          const service = new UserService(prisma);
          const user = await service.login(String(email), String(password));
          return user;
        } catch (e) {
          logger.error(e);
        }

        return null;
      },
    }),
  ],
};
