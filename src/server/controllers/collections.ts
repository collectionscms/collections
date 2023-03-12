import express, { Request, Response } from 'express';
import { Collection } from '../../shared/types';
import { getDatabase } from '../database/connection';
import asyncHandler from '../middleware/asyncHandler';
import permissionsHandler from '../middleware/permissionsHandler';

const app = express();

app.get(
  '/collections/:id',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const database = getDatabase();
    const id = Number(req.params.id);
    const collection = await database('superfast_collections')
      .queryContext({ toCamel: false })
      .where('id', id)
      .first();

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
    const database = getDatabase();
    const collections = await database('superfast_collections').queryContext({
      toCamel: false,
    });

    res.json({ collections: collections });
  })
);

app.post(
  '/collections',
  permissionsHandler([{ collection: 'superfast_collections', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = getDatabase();

    await database.transaction(async (tx) => {
      try {
        await tx.schema.createTable(req.body.collection, function (table) {
          table.increments();
          table.timestamps(true, true);
        });

        const collections = await tx('superfast_collections')
          .queryContext({ toCamel: false })
          .insert(req.body, '*');

        await tx('superfast_fields').insert({
          collection: req.body.collection,
          field: 'id',
          label: 'id',
          interface: 'input',
          required: true,
          readonly: true,
          hidden: true,
        });

        await tx.commit();
        res.json({ collection: collections[0] });
      } catch (e) {
        await tx.rollback();
        res.status(500).end();
      }
    });
  })
);

app.patch(
  '/collections/:id',
  permissionsHandler([{ collection: 'superfast_collections', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = getDatabase();
    const id = Number(req.params.id);
    await database('superfast_collections').where('id', id).update(req.body);

    res.status(204).end();
  })
);

app.delete(
  '/collections/:id',
  permissionsHandler([{ collection: 'superfast_collections', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = getDatabase();
    const id = Number(req.params.id);
    const meta = await database<Collection>('superfast_collections').where('id', id).first();

    await database.transaction(async (tx) => {
      try {
        await tx.schema.dropTable(meta.collection);
        await tx('superfast_collections').where('id', id).delete();
        await tx('superfast_fields').where('collection', meta.collection).delete();
        await tx('superfast_permissions').where('collection', meta.collection).delete();
        await tx('superfast_relations').where('many_collection', meta.collection).delete();
        await tx.commit();
        res.status(204).end();
      } catch (e) {
        await tx.rollback();
        res.status(500).end();
      }
    });
  })
);

export default app;
