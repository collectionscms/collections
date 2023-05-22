import express, { Request, Response } from 'express';
import { Knex } from 'knex';
import { Field } from '../../config/types.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  collectionPermissionsHandler,
  permissionsHandler,
} from '../middleware/permissionsHandler.js';
import { CollectionsRepository } from '../repositories/collections.js';
import { FieldsRepository } from '../repositories/fields.js';

const router = express.Router();

router.get(
  '/collections/:collection/fields',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new FieldsRepository();

    const fields = await repository.read({ collection: req.params.collection });

    fields.forEach((field) => {
      field.field = field.field;
      field.fieldOption = field.options ? JSON.parse(field.options) : null;
    });

    res.json({
      fields,
    });
  })
);

router.post(
  '/collections/:collection/fields',
  permissionsHandler([{ collection: 'superfast_fields', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const collection = req.params.collection;
    const repository = new FieldsRepository();
    const collectionsRepository = new CollectionsRepository();

    const collections = await collectionsRepository.read({ collection: collection });

    await repository.transaction(async (tx) => {
      const fieldId = await repository.transacting(tx).create(req.body);
      const field = await repository.transacting(tx).readOne(fieldId);
      await tx.transaction.schema.alterTable(collections[0].collection, (table) => {
        addColumnToTable(field, table);
      });

      res.json({ field });
    });
  })
);

router.patch(
  '/fields',
  permissionsHandler([{ collection: 'superfast_fields', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new FieldsRepository();

    await repository.transaction(async (tx) => {
      req.body.forEach(async (field: Field) => {
        await repository.transacting(tx).update(field.id, field);
      });
    });

    res.status(204).end();
  })
);

router.patch(
  '/fields/:id',
  permissionsHandler([{ collection: 'superfast_fields', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new FieldsRepository();
    const collectionsRepository = new CollectionsRepository();

    await repository.transaction(async (tx) => {
      await repository.transacting(tx).update(id, req.body);

      if (req.body.options) {
        const field = await repository.transacting(tx).readOne(id);
        const collection = (
          await collectionsRepository.transacting(tx).read({ collection: field.collection })
        )[0];

        await tx.transaction.schema.alterTable(
          collection.collection,
          (table: Knex.CreateTableBuilder) => {
            addColumnToTable(field, table, true);
          }
        );
      }
    });

    res.status(204).end();
  })
);

router.delete(
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

      if (collection.status_field === field.field) {
        await collectionsRepository.transacting(tx).update(collectionId, {
          status_field: null,
        });
      }

      res.status(204).end();
    });
  })
);

const addColumnToTable = (field: Field, table: Knex.CreateTableBuilder, alter: boolean = false) => {
  let column = null;

  switch (field.interface) {
    case 'input':
      column = table.string(field.field, 255);
      break;
    case 'selectDropdown':
      column = table.string(field.field, 255).defaultTo('');
      break;
    case 'inputMultiline':
    // case 'inputRichTextHtml':
    case 'inputRichTextMd':
      column = table.text(field.field);
      break;
    case 'boolean': {
      const value = field.options ? JSON.parse(field.options) : null;
      column = table.boolean(field.field).defaultTo(value?.defaultValue || false);
      break;
    }
    case 'dateTime':
      column = table.dateTime(field.field);
      break;
    case 'fileImage':
      column = table
        .integer(field.field)
        .unsigned()
        .index()
        .references('id')
        .inTable('superfast_files');
      break;
    default:
      throw new InvalidPayloadException('unexpected_field_type_specified');
  }

  if (alter) {
    column.alter();
  }

  return column;
};

export const fields = router;
