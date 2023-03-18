import express, { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import permissionsHandler from '../middleware/permissionsHandler';
import { CollectionsRepository } from '../repositories/collections';

const app = express();

app.get(
  '/collections/:id',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new CollectionsRepository();

    const collection = await repository.readOne(id);

    res.json({
      collection: {
        ...collection,
        fields: [],
      },
    });
  })
);

app.get(
  '/collections',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new CollectionsRepository();

    const collections = await repository.read();

    res.json({ collections: collections });
  })
);

app.post(
  '/collections',
  permissionsHandler([{ collection: 'superfast_collections', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new CollectionsRepository();

    await repository.transaction(async (tx) => {
      try {
        await tx.transaction.schema.createTable(req.body.collection, function (table) {
          table.increments();
          table.timestamps(true, true);
        });

        const collection = await repository.transacting(tx).create(req.body);

        await tx.transaction('superfast_fields').insert({
          collection: req.body.collection,
          field: 'id',
          label: 'id',
          interface: 'input',
          required: true,
          readonly: true,
          hidden: true,
        });

        await tx.transaction.commit();
        res.json({ collection: collection });
      } catch (e) {
        await tx.transaction.rollback();
        res.status(500).end();
      }
    });
  })
);

app.patch(
  '/collections/:id',
  permissionsHandler([{ collection: 'superfast_collections', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new CollectionsRepository();

    await repository.update(id, req.body);

    res.status(204).end();
  })
);

app.delete(
  '/collections/:id',
  permissionsHandler([{ collection: 'superfast_collections', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new CollectionsRepository();

    const meta = await repository.readOne(id);

    await repository.transaction(async (tx) => {
      try {
        await tx.transaction.schema.dropTable(meta.collection);
        await repository.transacting(tx).delete(id);
        await tx.transaction('superfast_fields').where('collection', meta.collection).delete();
        await tx.transaction('superfast_permissions').where('collection', meta.collection).delete();
        await tx
          .transaction('superfast_relations')
          .where('many_collection', meta.collection)
          .delete();
        await tx.transaction.commit();
        res.status(204).end();
      } catch (e) {
        await tx.transaction.rollback();
        res.status(500).end();
      }
    });
  })
);

export default app;
