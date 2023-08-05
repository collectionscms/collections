import express, { Request, Response } from 'express';
import { Knex } from 'knex';
import { Field } from '../../config/types.js';
import { SchemaOverview } from '../database/overview.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  collectionPermissionsHandler,
  permissionsHandler,
} from '../middleware/permissionsHandler.js';
import { BaseTransaction } from '../repositories/base.js';
import { CollectionsRepository } from '../repositories/collections.js';
import { FieldsRepository } from '../repositories/fields.js';
import { RelationsRepository } from '../repositories/relations.js';
import { FieldsService, addColumnToTable } from '../services/fields.js';

const router = express.Router();

router.get(
  '/collections/:collection/fields',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new FieldsRepository();

    const fieldSchemas = await repository.read({ collection: req.params.collection });
    const fields = fieldSchemas.map((field) => {
      return {
        ...field,
        fieldOption: field.options ? JSON.parse(field.options) : null,
      } as Field;
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
    const service = new FieldsService(new FieldsRepository());
    const field = await service.createField(req.body);

    res.json({ field });
  })
);

/**
 * Add relational fields.
 */
router.post(
  '/fields/relations',
  permissionsHandler([{ collection: 'superfast_fields', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const fieldsRepository = new FieldsRepository();
    const relationsRepository = new RelationsRepository();

    await fieldsRepository.transaction(async (tx) => {
      const relationId = await relationsRepository.transacting(tx).create(req.body.relation);
      const relation = await relationsRepository.transacting(tx).readOne(relationId);

      var fields: Field[] = [];

      for (const postField of req.body.fields) {
        const fieldId = await fieldsRepository.transacting(tx).create(postField);
        const field = await fieldsRepository.transacting(tx).readOne(fieldId);
        fields.push(field as Field);

        await tx.transaction.schema.alterTable(field.collection, (table) => {
          addColumnToTable(field, table)?.references('id').inTable(relation.one_collection);
        });
      }

      res.json({ fields });
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

/**
 * Delete fields.
 * Execute in order of relation -> entity to avoid DB constraint errors.
 */
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
      /////////////////////////// Delete Relation ///////////////////////////

      await repository.transacting(tx).delete(id);

      if (collection.status_field === field.field) {
        await collectionsRepository.transacting(tx).update(collectionId, {
          status_field: null,
        });
      }

      // Delete many relation fields
      const oneRelations = await relationsRepository
        .transacting(tx)
        .read({ one_collection: collection.collection, one_field: field.field });

      for (let relation of oneRelations) {
        await deleteField(req.schema, tx, relation.many_collection, relation.many_field);
      }

      // Delete one relation fields
      const manyRelations = await relationsRepository.transacting(tx).read({
        many_collection: collection.collection,
        many_field: field.field,
      });

      for (let relation of manyRelations) {
        await deleteField(req.schema, tx, relation.one_collection, relation.one_field);
      }

      // Delete relations schema
      await relationsRepository
        .transacting(tx)
        .deleteMany({ many_collection: field.collection, many_field: field.field });

      await relationsRepository
        .transacting(tx)
        .deleteMany({ one_collection: field.collection, one_field: field.field });

      /////////////////////////// Delete Entity ///////////////////////////

      await deleteField(req.schema, tx, collection.collection, field.field);

      res.status(204).end();
    });
  })
);

/**
 * Delete meta and entity fields.
 *
 * @param schema
 * @param tx
 * @param collection
 * @param field
 */
const deleteField = async (
  schema: SchemaOverview,
  tx: BaseTransaction,
  collection: string,
  field: string
) => {
  const hasEntity = !schema.collections[collection].fields[field].alias;
  const existingRelation = schema.relations.find(
    (existingRelation) =>
      (existingRelation.collection === collection && existingRelation.field === field) ||
      (existingRelation.relatedCollection === collection && existingRelation.relatedField === field)
  );

  if (hasEntity) {
    await tx.transaction.schema.table(collection, (table) => {
      // If the FK already exists in the DB, drop it first
      if (existingRelation !== undefined) table.dropForeign(field);
      table.dropColumn(field);
    });
  }

  const repository = new FieldsRepository();
  await repository.transacting(tx).deleteMany({
    collection,
    field,
  });
};

export const fields = router;
