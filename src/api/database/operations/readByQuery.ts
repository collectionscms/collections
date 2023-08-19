import { Knex } from 'knex';
import { InvalidQueryException } from '../../../exceptions/invalidQuery.js';
import { FieldFilter, Filter, Sort } from '../types.js';

export type Arguments = {
  collection: string;
  database: Knex;
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

export const readByQuery = async <T>({
  database,
  collection,
  filter,
  sorts,
}: Arguments): Promise<T[]> => {
  const builder = database(collection);

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
  return results;
};
