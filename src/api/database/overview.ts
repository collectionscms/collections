import { Knex } from 'knex';
import { CollectionsRepository } from '../repositories/collections.js';
import { FieldsRepository } from '../repositories/fields.js';
import { RelationsRepository } from '../repositories/relations.js';
import { getDatabase } from './connection.js';
import { getSchemaInfo } from './inspector.js';

export type CollectionOverview = {
  collection: string;
  singleton: boolean;
  statusField: string | null;
  draftValue: string | null;
  publishValue: string | null;
  archiveValue: string | null;
  fields: {
    [name: string]: FieldOverview;
  };
};

export type FieldOverview = {
  field: string;
  alias: boolean;
};

export type Relation = {
  collection: string;
  field: string;
  relatedField: string;
  relatedCollection: string;
};

export type SchemaOverview = {
  collections: { [name: string]: CollectionOverview };
  relations: Relation[];
};

export const getSchemaOverview = async (options?: { database?: Knex }): Promise<SchemaOverview> => {
  const database = options?.database || getDatabase();
  const schemaInfo = await getSchemaInfo(database);

  const collectionsRepository = new CollectionsRepository();
  const fieldsRepository = new FieldsRepository();
  const relationsRepository = new RelationsRepository();

  const collections = await collectionsRepository.read();
  const fields = await fieldsRepository.read();

  const result: SchemaOverview = { collections: {}, relations: [] };

  for (let collection of collections) {
    const collectionFields = fields
      .filter((field) => field.collection === collection.collection)
      .reduce(
        (acc, field) => {
          acc[field.field] = {
            field: field.field,
            alias: schemaInfo[collection.collection].columns[field.field] === undefined,
          };
          return acc;
        },
        {} as { [name: string]: FieldOverview }
      );

    result.collections[collection.collection] = {
      collection: collection.collection,
      singleton: collection.singleton,
      statusField: collection.status_field,
      draftValue: collection.draft_value,
      publishValue: collection.publish_value,
      archiveValue: collection.archive_value,
      fields: collectionFields,
    };
  }

  const relations = await relationsRepository.read();
  result.relations = relations.map((relation) => {
    return {
      collection: relation.one_collection,
      field: relation.one_field,
      relatedField: relation.many_field,
      relatedCollection: relation.many_collection,
    };
  });

  return result;
};
