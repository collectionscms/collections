import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { Query } from '../database/types.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { multipartHandler } from '../middleware/multipartHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { CollectionsService } from '../services/collections.js';
import { FilesService } from '../services/files.js';
import { ImportDataService } from '../services/importData.js';

const router = express.Router();

router.get(
  '/collections/:collection',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const service = new CollectionsService({ schema: req.schema });
    const collection = await service
      .readMany({
        filter: { collection: { _eq: req.params.collection } },
      })
      .then((collections) => collections[0]);
    if (!collection) throw new RecordNotFoundException('record_not_found');

    res.json({
      collection: {
        ...collection,
      },
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

    res.json({ collections });
  })
);

router.post(
  '/collections',
  permissionsHandler([{ collection: 'superfast_collections', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const { ['status']: status, ...data } = req.body;

    const service = new CollectionsService({ schema: req.schema });
    const collectionId = await service.createCollection(data, status || false);

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

router.post(
  '/collections/import',
  asyncHandler(multipartHandler),
  permissionsHandler([{ collection: 'superfast_collections', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const keys = res.locals.savedFileKeys;
    const filesService = new FilesService({ schema: req.schema });
    const file = await filesService.readOne(keys[0]);

    const fileData = res.locals.fileData;
    const importDataService = new ImportDataService({ schema: req.schema });
    await importDataService.importData(file.type, fileData);

    return res.status(200).end();
  })
);

export const collections = router;
