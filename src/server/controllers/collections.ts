import { Collection } from '@shared/types';
import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncMiddleware from '../middleware/async';

const app = express();

app.get(
  '/collections/:id',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);
    const collection = await database('superfast_collections').where('id', id).first();

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
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const collections = await database('superfast_collections');

    res.json({ collections: collections });
  })
);

app.post(
  '/collections',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();

    await database.transaction(async (tx) => {
      try {
        await tx.schema.createTable(req.body.collection, function (table) {
          table.increments();
          table.timestamps(true, true);
        });

        const collections = await tx('superfast_collections').insert(req.body, '*');

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
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);
    await database('superfast_collections').where('id', id).update(req.body);

    res.status(204).end();
  })
);

app.delete(
  '/collections/:id',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);
    const meta = await database<Collection>('superfast_collections').where('id', id).first();

    await database.transaction(async (tx) => {
      try {
        await tx.schema.dropTable(meta.collection);
        await tx('superfast_collections').where('id', id).delete();
        await tx('superfast_fields').where('collection', meta.collection).delete();
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
