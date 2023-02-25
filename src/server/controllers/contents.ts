import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncHandler from '../middleware/asyncHandler';

const app = express();

app.get(
  '/collections/:slug/contents',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;
    const contents = await database(slug).queryContext({ toCamel: false });

    res.json({
      contents: contents,
    });
  })
);

app.get(
  '/collections/:slug/contents/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;
    const id = req.params.id;
    const content = await database(slug).queryContext({ toCamel: false }).where('id', id).first();

    res.json({
      content: content,
    });
  })
);

app.post(
  '/collections/:slug/contents',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;

    const content = await database(slug).queryContext({ toCamel: false }).insert(req.body);

    res.json({
      content: content,
    });
  })
);

app.patch(
  '/collections/:slug/contents/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;
    const id = Number(req.params.id);

    await database(slug).where('id', id).update(req.body);

    res.status(204).end();
  })
);

app.delete(
  '/collections/:slug/contents/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;
    const id = Number(req.params.id);

    await database(slug).where('id', id).delete();

    res.status(204).end();
  })
);

export default app;
