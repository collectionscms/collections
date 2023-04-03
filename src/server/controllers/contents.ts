import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../shared/exceptions/database/recordNotFound';
import asyncHandler from '../middleware/asyncHandler';
import { collectionPermissionsHandler } from '../middleware/permissionsHandler';
import CollectionsRepository from '../repositories/collections';
import ContentsRepository from '../repositories/contents';

const app = express();

app.get(
  '/collections/:slug/contents',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const repository = new ContentsRepository(slug);

    const conditions = await makeConditions(req, slug);
    const contents = await repository.read(conditions);
    const collection = await readCollection(slug);

    res.json(collection.singleton ? { content: contents[0] } : { contents: contents });
  })
);

app.get(
  '/collections/:slug/contents/:id',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const id = Number(req.params.id);

    const conditions = await makeConditions(req, slug);
    const content = await readContent(slug, { ...conditions, id });
    if (!content) throw new RecordNotFoundException('record_not_found');

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
    const repository = new ContentsRepository(slug);

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
    const repository = new ContentsRepository(slug);

    const conditions = await makeConditions(req, slug);
    const content = await readContent(slug, { ...conditions, id });
    if (!content) throw new RecordNotFoundException('record_not_found');

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
    const repository = new ContentsRepository(slug);

    const conditions = await makeConditions(req, slug);
    const content = await readContent(slug, { ...conditions, id });
    if (!content) throw new RecordNotFoundException('record_not_found');

    await repository.delete(id);

    res.status(204).end();
  })
);

async function readContent(slug: string, conditions: Partial<any>): Promise<unknown> {
  const repository = new ContentsRepository(slug);
  return (await repository.read(conditions))[0];
}

async function readCollection(slug: string) {
  const collectionsRepository = new CollectionsRepository();

  const collection = (await collectionsRepository.read({ collection: slug }))[0];
  if (!collection) throw new RecordNotFoundException('record_not_found');

  return collection;
}

// Get the status field and value from the collection.
async function makeConditions(req: Request, slug: string) {
  if (req.appAccess) return {};

  const conditions = {};
  const collection = await readCollection(slug);
  if (collection.statusField) {
    // For Non-application, only public data can be accessed.
    conditions[collection.statusField] = collection.publishValue;
  }

  return conditions;
}

export default app;
