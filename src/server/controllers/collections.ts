import express, { Request, Response } from 'express';
import { Field } from '../../config/types.js';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { CollectionsRepository } from '../repositories/collections.js';
import { FieldsRepository } from '../repositories/fields.js';
import { PermissionsRepository } from '../repositories/permissions.js';

const router = express.Router();

router.get(
  '/collections/:id',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new CollectionsRepository();

    const collection = await repository.readOne(id);
    if (!collection) throw new RecordNotFoundException('record_not_found');

    res.json({
      collection: {
        ...collection,
        fields: [],
      },
    });
  })
);

router.get(
  '/collections',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new CollectionsRepository();

    const collections = await repository.read();

    res.json({ collections });
  })
);

router.post(
  '/collections',
  permissionsHandler([{ collection: 'superfast_collections', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new CollectionsRepository();
    const fieldsRepository = new FieldsRepository();

    const data = req.body.status
      ? {
          ...req.body,
          statusField: 'status',
          draftValue: 'draft',
          publishValue: 'published',
          archiveValue: 'archived',
        }
      : req.body;
    delete data.status;

    await repository.transaction(async (tx) => {
      const collection = await repository.transacting(tx).create(data);

      await tx.transaction.schema.createTable(req.body.collection, (table) => {
        table.increments();
        table.timestamps(true, true);
        req.body.status && table.string('status').notNullable();
      });

      const fields: Field[] = [
        {
          id: null,
          collection: req.body.collection,
          field: 'id',
          label: 'id',
          interface: 'input',
          required: true,
          readonly: true,
          hidden: true,
          special: null,
          sort: null,
          options: null,
        },
        req.body.status && {
          id: null,
          collection: req.body.collection,
          field: 'status',
          label: 'Status',
          interface: 'selectDropdownStatus',
          required: true,
          readonly: false,
          hidden: false,
          special: null,
          sort: null,
          options: JSON.stringify({
            choices: [
              { label: 'Draft', value: 'draft' },
              { label: 'Published', value: 'published' },
              { label: 'Archived', value: 'archived' },
            ],
          }),
        },
      ];
      await fieldsRepository.transacting(tx).createMany(fields);

      res.json({ collection });
    });
  })
);

router.patch(
  '/collections/:id',
  permissionsHandler([{ collection: 'superfast_collections', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new CollectionsRepository();
    const fieldsRepository = new FieldsRepository();

    await repository.transaction(async (tx) => {
      await repository.transacting(tx).update(id, req.body);

      if (req.body.statusField) {
        const collection = await repository.transacting(tx).readOne(id);
        const fields = await fieldsRepository
          .transacting(tx)
          .read({ collection: collection.collection, field: req.body.statusField });

        await fieldsRepository.transacting(tx).update(fields[0].id, {
          interface: 'selectDropdownStatus',
          required: true,
          options: JSON.stringify({
            choices: [
              { label: req.body.draftValue, value: req.body.draftValue },
              { label: req.body.publishValue, value: req.body.publishValue },
              { label: req.body.archiveValue, value: req.body.archiveValue },
            ],
          }),
        });
      }
    });

    res.status(204).end();
  })
);

router.delete(
  '/collections/:id',
  permissionsHandler([{ collection: 'superfast_collections', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new CollectionsRepository();
    const fieldsRepository = new FieldsRepository();
    const permissionsRepository = new PermissionsRepository();

    const collection = await repository.readOne(id);

    await repository.transaction(async (tx) => {
      await tx.transaction.schema.dropTable(collection.collection);
      await repository.transacting(tx).delete(id);
      await fieldsRepository.transacting(tx).deleteAll({ collection: collection.collection });
      await permissionsRepository.transacting(tx).deleteAll({ collection: collection.collection });

      await tx
        .transaction('superfast_relations')
        .where('many_collection', collection.collection)
        .delete();

      res.status(204).end();
    });
  })
);

export const collections = router;
