import type { Knex } from 'knex';
import { getDatabase } from '../database/connection';

export type AbstractRepositoryOptions = {
  knex?: Knex;
};

type AbstractRepository<T> = {
  read(data: Partial<T>): Promise<T[]>;
  readOne(id: number | Partial<T>): Promise<T>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: number, item: Partial<T>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
};

export abstract class BaseRepository<T> implements AbstractRepository<T> {
  collection: string;
  knex: Knex;

  constructor(collection: string, options?: AbstractRepositoryOptions) {
    this.collection = collection;
    this.knex = options?.knex || getDatabase();
    return this;
  }

  public get queryBuilder(): Knex.QueryBuilder {
    return this.knex(this.collection);
  }

  read(data: Partial<T>): Promise<T[]> {
    return this.queryBuilder.where(data).select();
  }

  readOne(id: number | Partial<T>): Promise<T> {
    return this.queryBuilder.where('id', id).first();
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    const [output] = await this.queryBuilder
      .queryContext({ toSnake: true })
      .insert(item)
      .returning('id');

    return output as Promise<T>;
  }

  update(id: number, item: Partial<T>): Promise<boolean> {
    return this.queryBuilder.where('id', id).queryContext({ toSnake: true }).update(item);
  }

  delete(id: number): Promise<boolean> {
    return this.queryBuilder.where('id', id).del();
  }
}
