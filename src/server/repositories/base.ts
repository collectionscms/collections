import { getDatabase } from '../database/connection.js';
import type { Knex } from 'knex';

export type AbstractRepositoryOptions = {
  knex?: Knex;
};

type AbstractRepository<T> = {
  read(data: Partial<T>): Promise<T[]>;
  readOne(id: number | Partial<T>): Promise<T>;
  create(item: Omit<T, 'id'>): Promise<T>;
  createMany(items: T[]): Promise<T[]>;
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

  async create(item: Omit<T, 'id'>): Promise<T> {
    const [output] = await this.queryBuilder.insert(item).returning('id');

    return output as Promise<T>;
  }

  createMany(items: T[]): Promise<T[]> {
    return this.queryBuilder.insert<T>(items) as Promise<T[]>;
  }

  update(id: number, item: Partial<T>): Promise<boolean> {
    return this.queryBuilder.where('id', id).update(item);
  }

  delete(id: number): Promise<boolean> {
    return this.queryBuilder.where('id', id).del();
  }
}
