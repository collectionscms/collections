import { Knex } from 'knex';
import { CollectionsService } from '../services/collections.js';
import { FieldsService } from '../services/fields.js';
import { RelationsService } from '../services/relations.js';
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
  special: string | null;
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

/**
 * @description get schema overview
 * @param options
 * @returns schema overview
 */
export const getSchemaOverview = async (options?: { database?: Knex }): Promise<SchemaOverview> => {
  const database = options?.database || getDatabase();
  const schemaInfo = await getSchemaInfo(database);
  const schema: SchemaOverview = { collections: {}, relations: [] };

  // /////////////////////////////////////
  // Collections
  // /////////////////////////////////////
  const collectionsService = new CollectionsService({ database, schema });
  const collections = await collectionsService.readMany();

  const fieldsService = new FieldsService({ database, schema });
  const fields = await fieldsService.readMany();

  for (const [collection, info] of Object.entries(schemaInfo)) {
    const metaCollection = collections.find((c) => c.collection === collection);

    schema.collections[collection] = {
      collection: collection,
      singleton: metaCollection && metaCollection.singleton ? true : false,
      statusField: metaCollection ? metaCollection.status_field : null,
      draftValue: metaCollection ? metaCollection.draft_value : null,
      publishValue: metaCollection ? metaCollection.publish_value : null,
      archiveValue: metaCollection ? metaCollection.archive_value : null,
      fields: Object.values(info.columns).reduce(
        (acc, column) => {
          const field = fields.find(
            (f) => f.collection === collection && f.field === column.column_name
          );

          acc[column.column_name] = {
            field: column.column_name,
            special: field?.special || null,
            alias: info.columns[column.column_name] === undefined,
          };
          return acc;
        },
        {} as { [name: string]: FieldOverview }
      ),
    };
  }

  // /////////////////////////////////////
  // Alias fields
  // /////////////////////////////////////
  for (const field of fields) {
    if (!schema.collections[field.collection]) continue;
    if (schema.collections[field.collection].fields[field.field]) continue;

    schema.collections[field.collection].fields[field.field] = {
      field: field.field,
      special: field.special,
      alias: true,
    };
  }

  // /////////////////////////////////////
  // Relations
  // /////////////////////////////////////
  const relationsService = new RelationsService({ database, schema });
  const relations = await relationsService.readMany();

  schema.relations = relations.map((relation) => {
    return {
      collection: relation.one_collection,
      field: relation.one_field,
      relatedField: relation.many_field,
      relatedCollection: relation.many_collection,
    };
  });

  return schema;
};
