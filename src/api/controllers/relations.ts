import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { collectionPermissionsHandler } from '../middleware/permissionsHandler.js';
import { RelationsService } from '../services/relations.js';

const router = express.Router();

router.get(
  '/relations/:collection/:field',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const collection = req.params.collection;
    const field = req.params.field;

    const service = new RelationsService({ schema: req.schema });
    const relations = await service.getRelations(collection, field);

    res.json({
      relations,
    });
  })
);

export const relations = router;
