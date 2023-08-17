import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { Field } from '../database/schemas.js';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base.js';

export class FieldsRepository extends BaseRepository<Field> {
  constructor(collection: string = 'superfast_fields', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): FieldsRepository {
    const repositoryTransaction = new FieldsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  /**
   * Returns a list sorted in asc order.
   * Chaining orderBy is a workaround for the knex bug.
   * see: https://github.com/knex/knex/issues/5135#issuecomment-1160936433
   *
   * @param data
   * @returns
   */
  read(data: Partial<FieldSchema> = {}): Promise<FieldSchema[]> {
    return this.queryBuilder.where(data).orderBy('sort', 'asc', 'last').orderBy('sort', 'asc');
  }

  async create(item: Omit<FieldSchema, 'id'>): Promise<number> {
    await this.checkUniqueField(item.collection, item.field);
    return super.create(item);
  }

  private async checkUniqueField(collection: string, field: string) {
    const fields = await this.read({ collection, field });
    if (fields.length) {
      throw new RecordNotUniqueException('already_registered_name');
    }
  }
}
