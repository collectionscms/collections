import { camelCase } from 'change-case';
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
import { RelationsRepository } from '../repositories/relations.js';

const router = express.Router();

router.get(
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

router.post(
  '/fields',
  permissionsHandler([{ collection: 'superfast_fields', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const repository = new FieldsRepository();

    await repository.transaction(async (tx) => {
      const field = await repository.transacting(tx).create(req.body);
      await tx.transaction.schema.alterTable(field.collection, (table) => {
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
    const relationsRepository = new RelationsRepository();

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

      // Delete many relation fields
      const oneRelations = await relationsRepository
        .transacting(tx)
        .read({ oneCollection: collection.collection, oneField: field.field });

      for (let relation of oneRelations) {
        await repository.transacting(tx).deleteMany({
          collection: relation.manyCollection,
          field: relation.manyField,
        });

        await tx.transaction.schema.table(relation.manyCollection, (table) => {
          table.dropColumn(relation.manyField);
        });
      }

      // Delete one relation fields
      const manyRelations = await relationsRepository.transacting(tx).read({
        manyCollection: collection.collection,
        manyField: field.field,
      });

      for (let relation of manyRelations) {
        await repository.transacting(tx).deleteMany({
          collection: relation.oneCollection,
          field: relation.oneField,
        });

        await tx.transaction.schema.table(relation.oneCollection, (table) => {
          table.dropColumn(relation.oneField!);
        });
      }

      // Delete relations
      await relationsRepository
        .transacting(tx)
        .deleteMany({ manyCollection: field.collection, manyField: field.field });

      await relationsRepository
        .transacting(tx)
        .deleteMany({ oneCollection: field.collection, oneField: field.field });

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
    case 'listOneToMany':
      // noop
      break;
    case 'selectDropdownManyToOne':
      column = table.integer(field.field).unsigned().index();
      break;
    default:
      throw new InvalidPayloadException('unexpected_field_type_specified');
  }

  if (column && alter) {
    column.alter();
  }

  return column;
};

export const fields = router;
