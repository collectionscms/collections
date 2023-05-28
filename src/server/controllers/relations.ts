import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  collectionPermissionsHandler,
  permissionsHandler,
} from '../middleware/permissionsHandler.js';
import { RelationsRepository } from '../repositories/relations.js';

const router = express.Router();

router.post(
  '/relations',
  permissionsHandler([{ collection: 'superfast_relations', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new RelationsRepository();

    await repository.transaction(async (tx) => {
      const relationId = await repository.transacting(tx).create(req.body);
      const relation = await repository.transacting(tx).readOne(relationId);

      await tx.transaction.schema.alterTable(relation.many_collection, async (table) => {
        const column = table
          .integer(relation.many_field)
          .references('id')
          .inTable(relation.one_collection);
        column.alter();
      });

      res.json({
        relation,
      });
    });
  })
);

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
