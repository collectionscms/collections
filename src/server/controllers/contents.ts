import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { pick } from '../../utilities/pick.js';
import { CollectionOverview, FieldOverview } from '../database/overview.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { collectionExists } from '../middleware/collectionExists.js';
import { collectionPermissionsHandler } from '../middleware/permissionsHandler.js';
import { ContentsRepository } from '../repositories/contents.js';

const router = express.Router();

router.get(
  '/collections/:collection/contents',
  collectionExists,
  collectionPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const { collection, singleton } = req.collection;
    const contentsRepository = new ContentsRepository(collection);

    const conditions = makeConditions(req, req.collection);
    const contents = await contentsRepository.readMany(conditions, req.schema);

    if (singleton) {
      res.json({ data: contents[0] });
    } else {
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

    const conditions = { ...makeConditions(req, req.collection), id };
    const content = (await contentsRepository.readMany(conditions, req.schema))[0];

    if (!content) throw new RecordNotFoundException('record_not_found');

    res.json({
      data: content,
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
      const relationDeletedBody = pick(req.body, nonAliasFields(fields));

      // Save content
      const contentId = await contentsRepository.transacting(tx).create(relationDeletedBody);

      // Update relational foreign key
      const relations = req.schema.relations.filter(
        (relation) => relation.collection === collection
      );

      for (let relation of relations) {
        const postContentData = req.body[relation.field];
        if (postContentData) {
          const postContentIds = postContentData.map((manyCollection: any) => manyCollection.id);

          const repository = new ContentsRepository(relation.relatedCollection);
          await repository
            .transacting(tx)
            .saveOneToMany(contentId, relation.relatedField, postContentIds);
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
      const relationDeletedBody = pick(req.body, nonAliasFields(fields));
      await contentsRepository.transacting(tx).update(id, relationDeletedBody);

      // Update relational foreign key
      const relations = req.schema.relations.filter(
        (relation) => relation.collection === collection
      );

      for (let relation of relations) {
        const postContentData = req.body[relation.field];
        if (postContentData) {
          const postContentIds = postContentData.map((manyCollection: any) => manyCollection.id);

          const repository = new ContentsRepository(relation.relatedCollection);
          await repository.transacting(tx).saveOneToMany(id, relation.relatedField, postContentIds);
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
const nonAliasFields = (fields: FieldOverview[]) =>
  fields
    .filter((field) => !field.alias)
    .reduce((acc: string[], field): string[] => {
      return [...acc, field.field];
    }, []);

// Get the status field and value from the collection.
const makeConditions = (req: Request, collection: CollectionOverview) => {
  if (req.appAccess) return {};

  const conditions: Record<string, any> = {};
  if (collection.statusField) {
    // For Non-application, only public data can be accessed.
    conditions[collection.statusField] = collection.publishValue;
  }

  return conditions;
};

export const contents = router;
