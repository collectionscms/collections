import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { pick } from '../../utilities/pick.js';
import { FieldOverview } from '../database/overview.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { collectionExists } from '../middleware/collectionExists.js';
import { collectionPermissionsHandler } from '../middleware/permissionsHandler.js';
import { BaseTransaction } from '../repositories/base.js';
import { CollectionsRepository } from '../repositories/collections.js';
import { ContentsRepository } from '../repositories/contents.js';
import { RelationsRepository } from '../repositories/relations.js';

const router = express.Router();

router.get(
  '/collections/:collection/contents',
  collectionExists,
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const { collection, singleton } = req.collection;
    const contentsRepository = new ContentsRepository(collection);

    const conditions = await makeConditions(req, collection);

    if (singleton) {
      const content = await contentsRepository.readSingleton(collection, conditions);
      res.json({ data: content });
    } else {
      const contents = await contentsRepository.read(conditions);
      res.json({ data: contents });
    }
  })
);

router.get(
  '/collections/:collection/contents/:id',
  collectionExists,
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const { collection } = req.collection;
    const id = Number(req.params.id);
    const contentsRepository = new ContentsRepository(collection);

    const conditions = await makeConditions(req, collection);
    const content = await readContent(collection, { ...conditions, id });
    if (!content) throw new RecordNotFoundException('record_not_found');

    // relational contents (one-to-many)
    const relationalContents = await contentsRepository.readRelationalContents(id, collection);

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
  collectionExists,
  collectionPermissionsHandler('create'),
  asyncHandler(async (req: Request, res: Response) => {
    const { collection } = req.collection;
    const contentsRepository = new ContentsRepository(collection);

    await contentsRepository.transaction(async (tx) => {
      const fields = Object.values(req.collection.fields);
      const relationDeletedBody = pick(req.body, fieldsFilteredAlias(fields));

      // Save content
      const contentId = await contentsRepository.transacting(tx).create(relationDeletedBody);

      // Update relational foreign key
      const relations = req.schema.relations.filter(
        (relation) => relation.collection === collection
      );

      for (let relation of relations) {
        const manyCollectionData = req.body[relation.field];
        if (manyCollectionData) {
          const manyCollectionIds = manyCollectionData.map(
            (manyCollection: any) => manyCollection.id
          );
          await saveOneToMany(
            contentId,
            relation.collection,
            relation.field,
            manyCollectionIds,
            tx
          );
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
  collectionExists,
  collectionPermissionsHandler('update'),
  asyncHandler(async (req: Request, res: Response) => {
    const { collection } = req.collection;
    const id = Number(req.params.id);
    const contentsRepository = new ContentsRepository(collection);

    await contentsRepository.transaction(async (tx) => {
      const fields = Object.values(req.collection.fields);

      // Update content
      const relationDeletedBody = pick(req.body, fieldsFilteredAlias(fields));
      await contentsRepository.transacting(tx).update(id, relationDeletedBody);

      // Update relational foreign key
      const relations = req.schema.relations.filter(
        (relation) => relation.collection === collection
      );

      for (let relation of relations) {
        const manyCollectionData = req.body[relation.field];
        if (manyCollectionData) {
          const manyCollectionIds = manyCollectionData.map(
            (manyCollection: any) => manyCollection.id
          );
          await saveOneToMany(id, relation.collection, relation.field, manyCollectionIds, tx);
        }
      }

      res.status(204).end();
    });
  })
);

router.delete(
  '/collections/:collection/contents/:id',
  collectionExists,
  collectionPermissionsHandler('delete'),
  asyncHandler(async (req: Request, res: Response) => {
    const { collection } = req.collection;
    const id = Number(req.params.id);
    const contentsRepository = new ContentsRepository(collection);

    await contentsRepository.transaction(async (tx) => {
      await contentsRepository.transacting(tx).delete(id);

      // Relational foreign key to null
      const relations = req.schema.relations.filter(
        (relation) => relation.collection === collection
      );

      for (let relation of relations) {
        const repository = new ContentsRepository(relation.relatedCollection);
        const contents = await repository.transacting(tx).read({ [relation.relatedField]: id });
        for (let content of contents) {
          await repository.transacting(tx).update(content.id, { [relation.relatedField]: null });
        }
      }

      res.status(204).end();
    });
  })
);

// Returns an array of non-alias field names.
const fieldsFilteredAlias = (fields: FieldOverview[]) =>
  fields
    .filter((field) => !field.alias)
    .reduce((acc: string[], field): string[] => {
      return [...acc, field.field];
    }, []);

const readContent = async (collectionName: string, conditions: Partial<any>): Promise<unknown> => {
  const repository = new ContentsRepository(collectionName);
  return (await repository.read(conditions))[0];
};

const readCollection = async (collectionName: string) => {
  const collectionsRepository = new CollectionsRepository();

  const collection = (await collectionsRepository.read({ collection: collectionName }))[0];
  if (!collection) throw new RecordNotFoundException('record_not_found');

  return collection;
};

// Get the status field and value from the collection.
const makeConditions = async (req: Request, collectionName: string) => {
  if (req.appAccess) return {};

  const conditions: Record<string, any> = {};
  const collection = await readCollection(collectionName);
  if (collection.status_field) {
    // For Non-application, only public data can be accessed.
    conditions[collection.status_field] = collection.publish_value;
  }

  return conditions;
};

const saveOneToMany = async (
  contentId: number,
  oneCollection: string,
  oneField: string,
  manyCollectionIds: number[],
  tx: BaseTransaction
) => {
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
};

export const contents = router;
