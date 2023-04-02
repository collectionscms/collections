import express, { Request, Response } from 'express';
import { Knex } from 'knex';
import { camelCase } from 'lodash';
import { Field } from '../../shared/types';
import asyncHandler from '../middleware/asyncHandler';
import permissionsHandler, { collectionPermissionsHandler } from '../middleware/permissionsHandler';
import CollectionsRepository from '../repositories/collections';
import FieldsRepository from '../repositories/fields';

const app = express();

app.get(
  '/collections/:slug/fields',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const repository = new FieldsRepository();

    const fields = await repository.read({ collection: slug });

    fields.forEach((field) => {
      field.field = camelCase(field.field);
      field.fieldOption = field.options ? JSON.parse(field.options) : null;
    });

    res.json({
      fields,
    });
  })
);

app.post(
  '/collections/:slug/fields',
  permissionsHandler([{ collection: 'superfast_fields', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const repository = new FieldsRepository();
    const collectionsRepository = new CollectionsRepository();

    const collections = await collectionsRepository.read({ collection: slug });

    await repository.transaction(async (tx) => {
      const field = await repository.transacting(tx).create(req.body);
      await tx.transaction.schema.alterTable(collections[0].collection, (table) => {
        addColumnToTable(req.body, table);
      });

      res.json({ field });
    });
  })
);

app.delete(
  '/collections/:collectionId/fields/:id',
  permissionsHandler([{ collection: 'superfast_fields', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionId = Number(req.params.collectionId);
    const id = Number(req.params.id);
    const repository = new FieldsRepository();
    const collectionsRepository = new CollectionsRepository();

    const collection = await collectionsRepository.readOne(collectionId);
    const field = await repository.readOne(id);

    await repository.transaction(async (tx) => {
      await repository.transacting(tx).delete(id);
      await tx.transaction.schema.alterTable(collection.collection, (table) => {
        table.dropColumn(field.field);
      });

      if (collection.statusField === field.field) {
        await collectionsRepository.transacting(tx).update(collectionId, {
          statusField: null,
        });
      }

      res.status(204).end();
    });
  })
);

const addColumnToTable = (field: Field, table: Knex.CreateTableBuilder) => {
  let column = null;

  switch (field.interface) {
    case 'input':
      column = table.string(field.field, 255);
      break;
    case 'selectDropdown':
      column = table.string(field.field, 255).defaultTo('');
      break;
    case 'inputMultiline':
    case 'inputRichTextHtml':
    case 'inputRichTextMd':
      column = table.text(field.field);
      break;
    default:
      break;
  }

  return column;
};

export default app;
