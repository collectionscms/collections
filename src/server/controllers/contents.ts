import express, { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { collectionPermissionsHandler } from '../middleware/permissionsHandler';
import ContentsRepository from '../repositories/contents';

const app = express();

app.get(
  '/collections/:slug/contents',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const repository = new ContentsRepository(slug, req.appAccess);

    const contents = await repository.read();

    res.json({
      contents,
    });
  })
);

app.get(
  '/collections/:slug/contents/:id',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const id = Number(req.params.id);
    const repository = new ContentsRepository(slug, req.appAccess);

    const content = await repository.readOne(id);

    res.json({
      content,
    });
  })
);

app.post(
  '/collections/:slug/contents',
  collectionPermissionsHandler('create'),
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const repository = new ContentsRepository(slug, req.appAccess);

    const content = await repository.create(req.body);

    res.json({
      content,
    });
  })
);

app.patch(
  '/collections/:slug/contents/:id',
  collectionPermissionsHandler('update'),
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const id = Number(req.params.id);
    const repository = new ContentsRepository(slug, req.appAccess);

    await repository.update(id, req.body);

    res.status(204).end();
  })
);

app.delete(
  '/collections/:slug/contents/:id',
  collectionPermissionsHandler('delete'),
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const id = Number(req.params.id);
    const repository = new ContentsRepository(slug, req.appAccess);

    await repository.delete(id);

    res.status(204).end();
  })
);

export default app;
