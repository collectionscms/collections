import argon2 from 'argon2';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../database/connection';
import asyncMiddleware from '../middleware/async';

const app = express();

app.post(
  '/authentications/login',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const user = await database
      .select('u.id', 'u.user_name', 'u.password', {
        role_admin_access: 'r.admin_access',
      })
      .from('superfast_users AS u')
      .join('superfast_roles AS r', 'r.id', 'u.superfast_role_id')
      .where('email', req.body.email)
      .first();

    if (!user || !(await argon2.verify(user.password, req.body.password))) {
      return res.status(401).end();
    }

    const payload = {
      id: user.id,
      userName: user.userName,
      adminAccess: user.roleAdminAccess,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_TTL,
    });

    res.json({
      token: token,
    });
  })
);

export default app;
