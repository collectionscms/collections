import { RecordNotUniqueException } from '../../shared/exceptions/database/recordNotUnique';
import { Field } from '../../shared/types';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';

export default class FieldsRepository extends BaseRepository<Field> {
  constructor(collection: string = 'superfast_fields', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): FieldsRepository {
    const repositoryTransaction = new FieldsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  deleteAll(data: Partial<Field>): Promise<boolean> {
    return this.queryBuilder.where(data).delete();
  }

  async create(item: Omit<Field, 'id'>): Promise<Field> {
    await this.checkUniqueField(item.collection, item.field);
    const [output] = await this.queryBuilder.insert(item).returning('id');

    return output as Promise<Field>;
  }

  private async checkUniqueField(collection: string, field: string) {
    const fields = await this.read({ collection, field });
    if (fields.length) {
      throw new RecordNotUniqueException('already_registered_name');
    }
  }
}
