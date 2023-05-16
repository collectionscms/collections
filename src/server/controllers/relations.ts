import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { RelationsRepository } from '../repositories/relations.js';

const router = express.Router();

router.post(
  '/relations',
  permissionsHandler([{ collection: 'superfast_relations', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new RelationsRepository();

    await repository.transaction(async (tx) => {
      const relation = await repository.transacting(tx).create(req.body);

      await tx.transaction.schema.alterTable(relation.manyCollection, async (table) => {
        const column = table
          .integer(relation.manyField)
          .references('id')
          .inTable(relation.oneCollection);
        column.alter();
      });

      res.json({
        relation,
      });
    });
  })
);

export const relations = router;
