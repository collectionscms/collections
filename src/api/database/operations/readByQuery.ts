import { Knex } from 'knex';
import { InvalidQueryException } from '../../../exceptions/invalidQuery.js';
import { getHelpers } from '../helpers/index.js';
import { SchemaOverview } from '../overview.js';
import { applyTransformersToFields } from '../transformers.js';
import { FieldFilter, Filter, Sort } from '../types.js';

export type Arguments = {
  collection: string;
  database: Knex;
  schema: SchemaOverview;
  filter?: Filter | null;
  sorts?: Sort[] | null;
};

const applyFilter = (
  builder: Knex.QueryBuilder,
  field: string,
  fieldFilter: FieldFilter,
  syntax: 'where' | 'andWhere' | 'orWhere'
) => {
  const { _eq, _gt, _in } = fieldFilter as FieldFilter;
  if (_eq) {
    builder[syntax]({ [field]: _eq });
  } else if (_gt) {
    builder[syntax](field, '>', _gt);
  } else if (_in) {
    builder[syntax](field, 'in', _in);
  } else {
    throw new InvalidQueryException();
  }
};

export const readByQuery = async <T>(args: Arguments): Promise<T[]> => {
  let { database, collection, schema, filter, sorts } = args;
  const helpers = getHelpers(args.database);
  const builder = database(collection);
  const overview = schema.collections[collection];

  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      if (key === '_and' || key === '_or') {
        const filters = value as Filter[];
        for (const filter of filters) {
          for (const [field, fieldFilter] of Object.entries(filter)) {
            const syntax = key === '_and' ? 'andWhere' : 'orWhere';
            applyFilter(builder, field, fieldFilter, syntax);
          }
        }
      } else {
        applyFilter(builder, key, value, 'where');
      }
    }
  }

  if (sorts) {
    for (const sort of sorts) {
      builder.orderBy(sort.column, sort.order, sort.nulls);
    }
  }

  const results = await builder.select();

  if (overview) {
    for (const result of results) {
      await applyTransformersToFields('read', result, schema.collections[collection], helpers);
    }
  }

  return results;
};
