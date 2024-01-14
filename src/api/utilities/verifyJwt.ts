import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthUser } from '../../configs/types.js';
import { env } from '../../env.js';
import { InvalidTokenException } from '../../exceptions/invalidToken.js';
import { UnknownException } from '../../exceptions/storage/unknown.js';
import { TokenExpiredException } from '../../exceptions/tokenExpired.js';
import { logger } from '../../utilities/logger.js';

type DecodedType = AuthUser & { exp?: number; iat?: number };

export const verifyJwt = (token: string): DecodedType => {
  try {
    return jwt.verify(token, env.SECRET, {}) as DecodedType;
  } catch (e) {
    logger.error(e);

    const extension = {
      message: (e as Error).message,
    };

    if (e instanceof TokenExpiredError) {
      throw new TokenExpiredException(extension);
    } else if (e instanceof JsonWebTokenError) {
      throw new InvalidTokenException(extension);
    } else {
      throw new UnknownException('internal_server_error', extension);
    }
  }
};
