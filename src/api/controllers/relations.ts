import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { modelPermissionsHandler } from '../middleware/permissionsHandler.js';
import { RelationsService } from '../services/relations.js';

const router = express.Router();

router.get(
  '/relations/:modelId/:field',
  modelPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const modelId = req.params.modelId;
    const field = req.params.field;

    const service = new RelationsService({ schema: req.schema });
    const relations = await service.getRelations(modelId, field);

    res.json({
      relations,
    });
  })
);

export const relations = router;
