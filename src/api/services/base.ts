import { Knex } from 'knex';
import { getDatabase } from '../database/connection.js';
import { createMany } from '../database/operations/createMany.js';
import { createOne } from '../database/operations/createOne.js';
import { deleteMany } from '../database/operations/deleteMany.js';
import { deleteOne } from '../database/operations/deleteOne.js';
import { readById } from '../database/operations/readById.js';
import { readByQuery } from '../database/operations/readByQuery.js';
import { updateOne } from '../database/operations/updateOne.js';
import { SchemaOverview } from '../database/overview.js';
import { PrimaryKey, TypeWithId } from '../database/schemas.js';
import { Query } from '../database/types.js';

type AbstractService<T extends TypeWithId = any> = {
  readOne(key: PrimaryKey): Promise<T>;
  readMany(query?: Query): Promise<T[]>;
  createOne(data: Partial<T>): Promise<PrimaryKey>;
  createMany(data: Partial<T>[]): Promise<PrimaryKey[]>;
  updateOne(key: PrimaryKey, data: Partial<T>): Promise<PrimaryKey>;
  deleteOne(key: PrimaryKey): Promise<void>;
  deleteMany(keys: PrimaryKey[]): Promise<void>;
};

export type AbstractServiceOptions = {
  database?: Knex | Knex.Transaction;
  schema: SchemaOverview;
};

export class BaseTransaction {
  constructor(readonly transaction: Knex.Transaction<any, any[]>) {}
}

export class BaseService<T extends TypeWithId = any> implements AbstractService<T> {
  collection: string;
  database: Knex;
  schema: SchemaOverview;

  constructor(collection: string, options: AbstractServiceOptions) {
    this.collection = collection;
    this.schema = options.schema;
    this.database = options.database || getDatabase();
  }

  async transaction<T>(callback: (trx: BaseTransaction) => Promise<T>) {
    return this.database.transaction(async (tx) => {
      const baseTx = new BaseTransaction(tx);
      return callback(baseTx);
    });
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
    return await createOne({ database: this.database, collection: this.collection, data });
  }

  /**
   * @description update single item by primary key
   * @param key
   * @param data
   * @returns primary key
   */
  async updateOne(key: PrimaryKey, data: Partial<T>): Promise<PrimaryKey> {
    return await updateOne({ database: this.database, collection: this.collection, key, data });
  }

  /**
   * @description create multiple items
   * @param data
   * @returns primary keys
   */
  async createMany(data: Partial<T>[]): Promise<PrimaryKey[]> {
    return await createMany({ database: this.database, collection: this.collection, data });
  }

  /**
   * @description delete single item by primary key
   * @param key
   */
  async deleteOne(key: PrimaryKey): Promise<void> {
    await deleteOne({ database: this.database, collection: this.collection, key });
  }

  /**
   * @description delete multiple items by primary keys
   * @param keys
   */
  async deleteMany(keys: PrimaryKey[]): Promise<void> {
    await deleteMany({ database: this.database, collection: this.collection, keys });
  }
}
