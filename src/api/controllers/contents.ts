import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { collectionExists } from '../middleware/collectionExists.js';
import { collectionPermissionsHandler } from '../middleware/permissionsHandler.js';
import { ContentsService } from '../services/contents.js';

const router = express.Router();

router.get(
  '/collections/:collection/contents',
  collectionExists,
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const { collection, singleton } = req.collection;

    const service = new ContentsService(collection, { schema: req.schema });
    const contents = await service.getContents(req.appAccess || false, req.collection);

    if (singleton) {
      res.json({ data: contents[0] });
    } else {
      res.json({ data: contents });
    }
  })
);

router.get(
  '/collections/:collection/contents/:id',
  collectionExists,
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const { collection } = req.collection;
    const id = Number(req.params.id);

    const service = new ContentsService(collection, { schema: req.schema });
    const content = await service
      .getContents(req.appAccess || false, req.collection, id)
      .then((contents) => contents[0]);

    if (!content) throw new RecordNotFoundException('record_not_found');

    res.json({
      data: content,
    });
  })
);

router.post(
  '/collections/:collection/contents',
  collectionExists,
  collectionPermissionsHandler('create'),
  asyncHandler(async (req: Request, res: Response) => {
    const { collection } = req.collection;

    const contentsService = new ContentsService(collection, { schema: req.schema });
    const contentId = await contentsService.createContent(
      req.body,
      Object.values(req.collection.fields)
    );

    res.json({
      id: contentId,
    });
  })
);

router.patch(
  '/collections/:collection/contents/:id',
  collectionExists,
  collectionPermissionsHandler('update'),
  asyncHandler(async (req: Request, res: Response) => {
    const { collection } = req.collection;
    const id = Number(req.params.id);

    const contentsService = new ContentsService(collection, { schema: req.schema });
    await contentsService.updateContent(id, req.body, Object.values(req.collection.fields));

    res.status(204).end();
  })
);

router.delete(
  '/collections/:collection/contents/:id',
  collectionExists,
  collectionPermissionsHandler('delete'),
  asyncHandler(async (req: Request, res: Response) => {
    const { collection } = req.collection;
    const id = Number(req.params.id);

    const contentsService = new ContentsService(collection, { schema: req.schema });
    await contentsService.deleteContent(id);

    res.status(204).end();
  })
);

export const contents = router;
