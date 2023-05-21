import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { collectionPermissionsHandler } from '../middleware/permissionsHandler.js';
import { CollectionsRepository } from '../repositories/collections.js';
import { ContentsRepository } from '../repositories/contents.js';

const router = express.Router();

router.get(
  '/collections/:collection/contents',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionName = req.params.collection;
    const repository = new ContentsRepository(collectionName);

    const conditions = await makeConditions(req, collectionName);
    const contents = await repository.read(conditions);
    const collection = await readCollection(collectionName);

    res.json(collection.singleton ? { content: contents[0] } : { contents: contents });
  })
);

router.get(
  '/collections/:collection/contents/:id',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionName = req.params.collection;
    const id = Number(req.params.id);

    const conditions = await makeConditions(req, collectionName);
    const content = await readContent(collectionName, { ...conditions, id });
    if (!content) throw new RecordNotFoundException('record_not_found');

    res.json({
      content,
    });
  })
);

router.post(
  '/collections/:collection/contents',
  collectionPermissionsHandler('create'),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionName = req.params.collection;
    const repository = new ContentsRepository(collectionName);

    const contentId = await repository.create(req.body);

    res.json({
      id: contentId,
    });
  })
);

router.patch(
  '/collections/:collection/contents/:id',
  collectionPermissionsHandler('update'),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionName = req.params.collection;
    const id = Number(req.params.id);
    const repository = new ContentsRepository(collectionName);

    const conditions = await makeConditions(req, collectionName);
    const content = await readContent(collectionName, { ...conditions, id });
    if (!content) throw new RecordNotFoundException('record_not_found');

    await repository.update(id, req.body);

    res.status(204).end();
  })
);

router.delete(
  '/collections/:collection/contents/:id',
  collectionPermissionsHandler('delete'),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionName = req.params.collection;
    const id = Number(req.params.id);
    const repository = new ContentsRepository(collectionName);

    const conditions = await makeConditions(req, collectionName);
    const content = await readContent(collectionName, { ...conditions, id });
    if (!content) throw new RecordNotFoundException('record_not_found');

    await repository.delete(id);

    res.status(204).end();
  })
);

async function readContent(collectionName: string, conditions: Partial<any>): Promise<unknown> {
  const repository = new ContentsRepository(collectionName);
  return (await repository.read(conditions))[0];
}

async function readCollection(collectionName: string) {
  const collectionsRepository = new CollectionsRepository();

  const collection = (await collectionsRepository.read({ collection: collectionName }))[0];
  if (!collection) throw new RecordNotFoundException('record_not_found');

  return collection;
}

// Get the status field and value from the collection.
async function makeConditions(req: Request, collectionName: string) {
  if (req.appAccess) return {};

  const conditions: Record<string, any> = {};
  const collection = await readCollection(collectionName);
  if (collection.status_field) {
    // For Non-application, only public data can be accessed.
    conditions[collection.status_field] = collection.publish_value;
  }

  return conditions;
}

export const contents = router;
