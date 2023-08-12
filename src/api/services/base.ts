import { Knex } from 'knex';
import { getDatabase } from '../database/connection.js';
import { create } from '../database/operations/create.js';
import { update } from '../database/operations/update.js';
import { SchemaOverview } from '../database/overview.js';
import { PrimaryKey } from '../database/schemas.js';

type AbstractService<T> = {
  readOne(key: PrimaryKey): Promise<T>;
  readMany(query?: Query): Promise<T[]>;
  readByQuery(query: Query): Promise<T[]>;
  createOne(data: Partial<T>): Promise<PrimaryKey>;
  updateOne(key: PrimaryKey, data: Partial<T>): Promise<PrimaryKey>;
};

export type AbstractServiceOptions = {
  database?: Knex;
  schema: SchemaOverview;
};

export type Query = {};

export class BaseService<T> implements AbstractService<T> {
  collection: string;
  database: Knex;
  schema: SchemaOverview;

  constructor(collection: string, options: AbstractServiceOptions) {
    this.collection = collection;
    this.schema = options.schema;
    this.database = options.database || getDatabase();
  }

  public get queryBuilder(): Knex.QueryBuilder {
    return this.database(this.collection);
  }

  async readOne(key: number): Promise<T> {
    const results = await this.readByQuery({ id: key });
    return results[0];
  }

  async readMany(query: Query = {}): Promise<T[]> {
    return await this.readByQuery(query);
  }

  async readByQuery(query: Query): Promise<T[]> {
    //TODO: implement
    return await this.queryBuilder.where({}).select();
  }

  async createOne(data: Partial<T>): Promise<PrimaryKey> {
    return await create({ database: this.database, collection: this.collection, data });
  }

  async updateOne(key: PrimaryKey, data: Partial<T>): Promise<PrimaryKey> {
    return await update({ database: this.database, collection: this.collection, key, data });
  }
}
