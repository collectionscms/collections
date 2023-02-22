import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncMiddleware from '../middleware/async';

const app = express();

app.get(
  '/collections/:slug/contents',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;
    const contents = await database(slug).queryContext({ snakeToCamel: false });

    res.json({
      contents: contents,
    });
  })
);

app.get(
  '/collections/:slug/contents/:id',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;
    const id = req.params.id;
    const content = await database(slug)
      .queryContext({ snakeToCamel: false })
      .where('id', id)
      .first();

    res.json({
      content: content,
    });
  })
);

app.post(
  '/collections/:slug/contents',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;

    const content = await database(slug).queryContext({ snakeToCamel: false }).insert(req.body);

    res.json({
      content: content,
    });
  })
);

app.patch(
  '/collections/:slug/contents/:id',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;
    const id = Number(req.params.id);

    await database(slug).where('id', id).update(req.body);

    res.status(204).end();
  })
);

app.delete(
  '/collections/:slug/contents/:id',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;
    const id = Number(req.params.id);

    await database(slug).where('id', id).delete();

    res.status(204).end();
  })
);

export default app;
