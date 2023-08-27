import express, { Request, Response } from 'express';
import { GetCollection, GetCollections } from '../../config/types.js';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { Query } from '../database/types.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { CollectionsService } from '../services/collections.js';

const router = express.Router();

router.get(
  '/collections/:id',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const service = new CollectionsService({ schema: req.schema });
    const collection = await service.readOne(id);
    if (!collection) throw new RecordNotFoundException('record_not_found');

    res.json({
      collection: {
        ...collection,
      } as GetCollection,
    });
  })
);

router.get(
  '/collections',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const query: Query = {};
    if (req.query.collection) {
      query.filter = { collection: { _eq: req.query.collection as string } };
    }

    const service = new CollectionsService({ schema: req.schema });
    const collections = await service.readMany(query);

    res.json({ collections } as GetCollections);
  })
);

router.post(
  '/collections',
  permissionsHandler([{ collection: 'superfast_collections', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const service = new CollectionsService({ schema: req.schema });
    const collectionId = await service.createCollection(req.body);

    res.json({ id: collectionId });
  })
);

router.patch(
  '/collections/:id',
  permissionsHandler([{ collection: 'superfast_collections', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const service = new CollectionsService({ schema: req.schema });
    await service.updateCollection(id, req.body);

    res.status(204).end();
  })
);

router.delete(
  '/collections/:id',
  permissionsHandler([{ collection: 'superfast_collections', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const service = new CollectionsService({ schema: req.schema });
    await service.deleteCollection(id);

    res.status(204).end();
  })
);

export const collections = router;
