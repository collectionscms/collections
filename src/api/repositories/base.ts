import type { Knex } from 'knex';
import { getDatabase } from '../database/connection.js';

export type AbstractRepositoryOptions = {
  knex?: Knex;
};

type AbstractRepository<T> = {
  read(data: Partial<T>): Promise<T[]>;
  readOne(id: number | Partial<T>): Promise<T>;
  create(item: Omit<T, 'id'>): Promise<number>;
  createMany(items: T[]): Promise<void>;
  update(id: number, item: Partial<T>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
};

export class BaseTransaction {
  constructor(readonly transaction: Knex.Transaction<any, any[]>) {}
}

export abstract class BaseRepository<T> implements AbstractRepository<T> {
  collection: string;
  knex: Knex;

  constructor(collection: string, options?: AbstractRepositoryOptions) {
    this.collection = collection;
    this.knex = options?.knex || getDatabase();
  }

  async transaction<T>(callback: (trx: BaseTransaction) => Promise<T>) {
    return this.knex.transaction(async (knexTrx) => {
      const baseTrx = new BaseTransaction(knexTrx);
      return callback(baseTrx);
    });
  }

  abstract transacting(trx: BaseTransaction): BaseRepository<T>;

  public get queryBuilder(): Knex.QueryBuilder {
    return this.knex(this.collection);
  }

  read(data: Partial<T> = {}): Promise<T[]> {
    return this.queryBuilder.where(data).select();
  }

  readOne(id: number | Partial<T>): Promise<T> {
    return this.queryBuilder.where('id', id).first();
  }

  /**
   * Create a single new item.
   * Align return values by specifying returning.
   * However, MySQL is not specified because it is not supported.
   * see: https://knexjs.org/guide/query-builder.html#returning
   *
   * @param item
   * @returns
   */
  async create(item: Omit<T, 'id'>): Promise<number> {
    const builder = this.queryBuilder.insert(item);

    switch (this.knex.client.config.client) {
      case 'sqlite3':
      case 'pg':
        builder.returning('id');
        break;
    }

    const result = await builder.then((result) => result[0]);
    const id = typeof result === 'object' ? result['id'] : result;

    return id;
  }

  createMany(items: Omit<T, 'id'>[]): Promise<void> {
    return this.queryBuilder.insert(items);
  }

  update(id: number, item: Partial<T>): Promise<boolean> {
    return this.queryBuilder.where('id', id).update(item);
  }

  delete(id: number): Promise<boolean> {
    return this.queryBuilder.where('id', id).del();
  }

  deleteMany(data: Partial<T>): Promise<boolean> {
    return this.queryBuilder.where(data).del();
  }
}
