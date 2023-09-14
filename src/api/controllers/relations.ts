import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { collectionPermissionsHandler } from '../middleware/permissionsHandler.js';
import { RelationsService } from '../services/relations.js';

const router = express.Router();

router.get(
  '/relations/:collectionId/:field',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionId = req.params.collectionId;
    const field = req.params.field;

    const service = new RelationsService({ schema: req.schema });
    const relations = await service.getRelations(collectionId, field);

    res.json({
      relations,
    });
  })
);

export const relations = router;
