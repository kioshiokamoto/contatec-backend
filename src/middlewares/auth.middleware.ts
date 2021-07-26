import { Injectable, NestMiddleware } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    try {
      const token = req.header('Authorization').split('Bearer ')[1];
      if (!token) {
        return res.status(400).json({ msg: 'Autenticación inválida' });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: 'Autenticación inválida' });

        req.user = user;
        next();
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
}
