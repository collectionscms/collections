import express, { Request, Response } from 'express';
import { Knex } from 'knex';
import { camelCase } from 'lodash';
import { Collection, Field } from '../../shared/types';
import { getDatabase } from '../database/connection';
import asyncHandler from '../middleware/asyncHandler';
import permissionsHandler, { collectionPermissionsHandler } from '../middleware/permissionsHandler';

const app = express();

app.get(
  '/collections/:slug/fields',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const database = getDatabase();
    const slug = req.params.slug;
    const fields = await database('superfast_fields').where('collection', slug);

    fields.forEach((field) => {
      field.field = camelCase(field.field);
    });

    res.json({
      fields: fields,
    });
  })
);

app.post(
  '/collections/:slug/fields',
  permissionsHandler([{ collection: 'superfast_fields', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = getDatabase();
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
  permissionsHandler([{ collection: 'superfast_fields', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const database = getDatabase();
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
    case 'inputMultiline':
    case 'inputRichTextHtml':
    case 'inputRichTextMd':
      column = table.text(field.field);
      break;
  }

  return column;
};

export default app;
