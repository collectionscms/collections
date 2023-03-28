import express, { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import permissionsHandler from '../middleware/permissionsHandler';
import CollectionsRepository from '../repositories/collections';
import FieldsRepository from '../repositories/fields';
import PermissionsRepository from '../repositories/permissions';

const app = express();

app.get(
  '/collections/:id',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new CollectionsRepository();

    const collection = await repository.readOne(id);

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
    const repository = new CollectionsRepository();

    const collections = await repository.read();

    res.json({ collections });
  })
);

app.post(
  '/collections',
  permissionsHandler([{ collection: 'superfast_collections', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new CollectionsRepository();
    const fieldsRepository = new FieldsRepository();

    await repository.transaction(async (tx) => {
      const collection = await repository.transacting(tx).create(req.body);

      await tx.transaction.schema.createTable(req.body.collection, (table) => {
        table.increments();
        table.timestamps(true, true);
      });

      await fieldsRepository.transacting(tx).create({
        collection: req.body.collection,
        field: 'id',
        label: 'id',
        interface: 'input',
        options: null,
        required: true,
        readonly: true,
        hidden: true,
        special: null,
        sort: 1,
      });

      res.json({ collection });
    });
  })
);

app.patch(
  '/collections/:id',
  permissionsHandler([{ collection: 'superfast_collections', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new CollectionsRepository();

    await repository.update(id, req.body);

    res.status(204).end();
  })
);

app.delete(
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

export default app;
