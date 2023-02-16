import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncMiddleware from '../middleware/async';

const app = express();

app.get(
  '/collections/:slug/contents',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;
    const contents = await database(slug);

    res.json({
      contents: contents,
    });
  })
);

export default app;
