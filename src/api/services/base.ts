import { Knex } from 'knex';
import { getDatabase } from '../database/connection.js';
import { create } from '../database/operations/create.js';
import { readById } from '../database/operations/readById.js';
import { readByQuery } from '../database/operations/readByQuery.js';
import { update } from '../database/operations/update.js';
import { SchemaOverview } from '../database/overview.js';
import { PrimaryKey, TypeWithId } from '../database/schemas.js';

type Query = {
  filter?: Record<string, any>;
};

type AbstractService<T extends TypeWithId = any> = {
  readOne(key: PrimaryKey): Promise<T>;
  readMany(query?: Query): Promise<T[]>;
  createOne(data: Partial<T>): Promise<PrimaryKey>;
  createMany(data: Partial<T>[]): Promise<PrimaryKey[]>;
  updateOne(key: PrimaryKey, data: Partial<T>): Promise<PrimaryKey>;
  deleteOne(key: PrimaryKey): Promise<boolean>;
};

export type AbstractServiceOptions = {
  database?: Knex;
  schema: SchemaOverview;
};

export class BaseService<T extends TypeWithId = any> implements AbstractService<T> {
  collection: string;
  database: Knex;
  schema: SchemaOverview;

  constructor(collection: string, options: AbstractServiceOptions) {
    this.collection = collection;
    this.schema = options.schema;
    this.database = options.database || getDatabase();
  }

  /**
   * @description get single item by primary key
   * @param key
   * @returns item
   */
  async readOne(key: PrimaryKey): Promise<T> {
    return await readById<T>({ database: this.database, collection: this.collection, key });
  }

  /**
   * @description get multiple items by query
   * @param query
   * @returns items
   */
  async readMany(query: Query = {}): Promise<T[]> {
    return await readByQuery<T>({
      database: this.database,
      collection: this.collection,
      filter: query.filter,
    });
  }

  /**
   * @description create single item
   * @param data
   * @returns primary key
   */
  async createOne(data: Partial<T>): Promise<PrimaryKey> {
    return await create({ database: this.database, collection: this.collection, data });
  }

  /**
   * @description update single item by primary key
   * @param key
   * @param data
   * @returns primary key
   */
  async updateOne(key: PrimaryKey, data: Partial<T>): Promise<PrimaryKey> {
    return await update({ database: this.database, collection: this.collection, key, data });
  }

  async createMany(data: Partial<T>[]): Promise<number[]> {
    //TODO: implement
    throw new Error('Method not implemented.');
  }

  async deleteOne(id: number): Promise<boolean> {
    //TODO: implement
    throw new Error('Method not implemented.');
  }
}
