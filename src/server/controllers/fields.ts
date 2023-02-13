import { Knex } from 'knex';
import { Collection, Field } from '@shared/types';
import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncMiddleware from '../middleware/async';

const app = express();

app.get(
  '/collections/:id/fields',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);
    const fields = await database('superfast_fields').where('superfast_collection_id', id);

    res.json({
      fields: fields,
    });
  })
);

app.post(
  '/collections/:id/fields',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);
    const meta = await database<Collection>('superfast_collections').where('id', id).first();
    const addField = {
      ...req.body,
      superfast_collection_id: meta.id,
    };

    await database.transaction(async (tx) => {
      try {
        const field = await tx('superfast_fields').insert(addField);
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
