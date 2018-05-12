import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { Constants } from '../../constants';
import * as jwt from 'jsonwebtoken';
import { IAuthToken } from '@shared/interfaces/Auth';

@Middleware()
export class TokenMiddleware implements NestMiddleware {
  resolve(...args: any[]): ExpressMiddleware {
    return (req, res, next) => {
      const token = this.getTokenFromHeader(req.headers['authorization']);

      if (!token) {
        return next();
      }

      req.token = token;

      next();
    };
  }


  getTokenFromHeader(authHeader: string): IAuthToken {
    if (!authHeader) {
      return null;
    }

    const tokenString = authHeader.replace('Bearer', '').trim();

    if (tokenString.length === 0) {
      return null;
    }

    let decoded: IAuthToken;
    try {
      decoded = jwt.verify(tokenString, Constants.JWTSecret) as IAuthToken;
    } catch (err) {
      decoded = null;
    }
    return decoded;
  }

}
