import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { pick } from '../../utilities/pick.js';
import { referencedTypes } from '../database/schemas.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { collectionPermissionsHandler } from '../middleware/permissionsHandler.js';
import { BaseTransaction } from '../repositories/base.js';
import { CollectionsRepository } from '../repositories/collections.js';
import { ContentsRepository } from '../repositories/contents.js';
import { FieldsRepository } from '../repositories/fields.js';
import { RelationsRepository } from '../repositories/relations.js';

const router = express.Router();

router.get(
  '/collections/:collection/contents',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionName = req.params.collection;
    const repository = new ContentsRepository(collectionName);

    const conditions = await makeConditions(req, collectionName);
    const contents = await repository.read(conditions);
    const collection = await readCollection(collectionName);

    res.json(collection.singleton ? { content: contents[0] } : { contents: contents });
  })
);

router.get(
  '/collections/:collection/contents/:id',
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionName = req.params.collection;
    const id = Number(req.params.id);

    const conditions = await makeConditions(req, collectionName);
    const content = await readContent(collectionName, { ...conditions, id });
    if (!content) throw new RecordNotFoundException('record_not_found');

    // relational contents (one-to-many)
    const relationalContents = await readRelationalContents(id, collectionName);

    res.json({
      content: {
        ...content,
        ...relationalContents,
      },
    });
  })
);

router.post(
  '/collections/:collection/contents',
  collectionPermissionsHandler('create'),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionName = req.params.collection;
    const contentsRepository = new ContentsRepository(collectionName);
    const fieldsRepository = new FieldsRepository();

    const fields = await fieldsRepository.read({ collection: collectionName });

    await contentsRepository.transaction(async (tx) => {
      const fieldNames = fields
        .filter((field) => !referencedTypes.includes(field.interface))
        .map((field) => field.field);
      const relationDeletedBody = pick(req.body, fieldNames);

      // Save content
      const contentId = await contentsRepository.transacting(tx).create(relationDeletedBody);

      // Update relational foreign key
      const relationFields = fields.filter((field) => referencedTypes.includes(field.interface));
      for (let field of relationFields) {
        if (field.interface === 'listOneToMany') {
          const manyCollectionData = req.body[field.field];
          if (manyCollectionData) {
            const manyCollectionIds = manyCollectionData.map(
              (manyCollection: any) => manyCollection.id
            );
            await saveOneToMany(contentId, field.collection, field.field, manyCollectionIds, tx);
          }
        }
      }

      res.json({
        id: contentId,
      });
    });
  })
);

router.patch(
  '/collections/:collection/contents/:id',
  collectionPermissionsHandler('update'),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionName = req.params.collection;
    const id = Number(req.params.id);
    const contentsRepository = new ContentsRepository(collectionName);
    const fieldsRepository = new FieldsRepository();

    const fields = await fieldsRepository.read({ collection: collectionName });

    await contentsRepository.transaction(async (tx) => {
      // Update content
      const fieldNames = fields
        .filter((field) => !referencedTypes.includes(field.interface))
        .map((field) => field.field);
      const relationDeletedBody = pick(req.body, fieldNames);
      await contentsRepository.transacting(tx).update(id, relationDeletedBody);

      // Update relational foreign key
      const relationFields = fields.filter((field) => referencedTypes.includes(field.interface));
      for (let field of relationFields) {
        if (field.interface === 'listOneToMany') {
          const manyCollectionData = req.body[field.field];
          if (manyCollectionData) {
            const manyCollectionIds = manyCollectionData.map(
              (manyCollection: any) => manyCollection.id
            );
            await saveOneToMany(id, field.collection, field.field, manyCollectionIds, tx);
          }
        }
      }

      res.status(204).end();
    });
  })
);

router.delete(
  '/collections/:collection/contents/:id',
  collectionPermissionsHandler('delete'),
  asyncHandler(async (req: Request, res: Response) => {
    const collectionName = req.params.collection;
    const id = Number(req.params.id);
    const contentsRepository = new ContentsRepository(collectionName);
    const fieldsRepository = new FieldsRepository();
    const relationsRepository = new RelationsRepository();

    const fields = await fieldsRepository.read({ collection: collectionName });
    const relationFields = fields.filter((field) => referencedTypes.includes(field.interface));

    await contentsRepository.transaction(async (tx) => {
      await contentsRepository.transacting(tx).delete(id);

      // Relational foreign key to null
      for (let field of relationFields) {
        if (field.interface === 'listOneToMany') {
          const relation = (
            await relationsRepository.transacting(tx).read({
              one_collection: field.collection,
              one_field: field.field,
            })
          )[0];

          const repository = new ContentsRepository(relation.many_collection);
          const contents = await repository.transacting(tx).read({ [relation.many_field]: id });
          for (let content of contents) {
            await repository
              .transacting(tx)
              .update((content as any).id, { [relation.many_field]: null });
          }
        }
      }

      res.status(204).end();
    });
  })
);

async function readContent(collectionName: string, conditions: Partial<any>): Promise<unknown> {
  const repository = new ContentsRepository(collectionName);
  return (await repository.read(conditions))[0];
}

async function readCollection(collectionName: string) {
  const collectionsRepository = new CollectionsRepository();

  const collection = (await collectionsRepository.read({ collection: collectionName }))[0];
  if (!collection) throw new RecordNotFoundException('record_not_found');

  return collection;
}

// Get the relational contents of the collection.
async function readRelationalContents(contentId: number, collectionName: string) {
  const fieldsRepository = new FieldsRepository();
  const relationsRepository = new RelationsRepository();
  const fields = await fieldsRepository.read({ collection: collectionName });

  const relationalContents: Record<string, any> = {};
  const referencedFields = fields.filter((field) => referencedTypes.includes(field.interface));
  for (let field of referencedFields) {
    const relations = await relationsRepository.read({
      one_collection: field.collection,
      one_field: field.field,
    });
    if (!relations[0]) return;

    const contentsRepository = new ContentsRepository(relations[0].many_collection);

    const params: Record<string, any> = {};
    params[relations[0].many_field] = contentId;

    const contents = await contentsRepository.read(params);
    relationalContents[field.field] = contents;
  }

  return relationalContents;
}

// Get the status field and value from the collection.
async function makeConditions(req: Request, collectionName: string) {
  if (req.appAccess) return {};

  const conditions: Record<string, any> = {};
  const collection = await readCollection(collectionName);
  if (collection.status_field) {
    // For Non-application, only public data can be accessed.
    conditions[collection.status_field] = collection.publish_value;
  }

  return conditions;
}

async function saveOneToMany(
  contentId: number,
  oneCollection: string,
  oneField: string,
  manyCollectionIds: number[],
  tx: BaseTransaction
) {
  const relationsRepository = new RelationsRepository();

  const relation = (
    await relationsRepository.transacting(tx).read({
      one_collection: oneCollection,
      one_field: oneField,
    })
  )[0];

  const postData: Record<string, any> = {};
  postData[relation.many_field] = contentId;

  const repository = new ContentsRepository(relation.many_collection);
  for (let id of manyCollectionIds) {
    await repository.transacting(tx).update(id, postData);
  }
}

export const contents = router;
