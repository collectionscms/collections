import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { collectionPermissionsHandler } from '../middleware/permissionsHandler.js';
import { RelationsRepository } from '../repositories/relations.js';

const router = express.Router();

router.get(
  '/relations/:collection/:field',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const collection = req.params.collection;
    const field = req.params.field;
    const repository = new RelationsRepository();

    const relations = await repository.readRelations(collection, field);

    res.json({
      relations,
    });
  })
);

export const relations = router;
