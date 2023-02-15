import { Knex } from 'knex';
import { Collection, Field } from '@shared/types';
import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncMiddleware from '../middleware/async';

const app = express();

app.get(
  '/collections/:slug/fields',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;
    const fields = await database('superfast_fields').where('collection', slug);

    res.json({
      fields: fields,
    });
  })
);

app.post(
  '/collections/:slug/fields',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const slug = req.params.slug;
    const meta = await database<Collection>('superfast_collections')
      .where('collection', slug)
      .first();

    await database.transaction(async (tx) => {
      try {
        const field = await tx('superfast_fields').insert(req.body);
        await tx.schema.alterTable(meta.collection, function (table) {
          addColumnToTable(req.body, table);
        });

        await tx.commit();
        res.json({ field: field });
      } catch (e) {
        await tx.rollback();
        res.status(500).end();
      }
    });
  })
);

app.delete(
  '/collections/:collectionId/fields/:id',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const collectionId = Number(req.params.collectionId);
    const id = Number(req.params.id);

    const metaCollection = await database('superfast_collections')
      .where('id', collectionId)
      .first();
    const metaField = await database('superfast_fields').where('id', id).first();

    await database.transaction(async (tx) => {
      try {
        await tx('superfast_fields').where('id', id).delete();
        await tx.schema.alterTable(metaCollection.collection, function (table) {
          table.dropColumn(metaField.field);
        });

        await tx.commit();
        res.status(204).end();
      } catch (e) {
        await tx.rollback();
        res.status(500).end();
      }
    });
  })
);

const addColumnToTable = (field: Field, table: Knex.CreateTableBuilder) => {
  var column = null;

  switch (field.interface) {
    case 'input':
      column = table.string(field.field, 255);
      break;
    case 'input-multiline':
    case 'input-rich-text-html':
    case 'input-rich-text-md':
      column = table.text(field.field);
      break;
  }

  if (field.required) {
    column.notNullable();
  }

  return column;
};

export default app;
