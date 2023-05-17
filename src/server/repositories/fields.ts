import { Field } from '../../config/types.js';
import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
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

  read(data: Partial<Field> = {}): Promise<Field[]> {
    return this.queryBuilder.where(data).orderByRaw('sort ASC NULLS LAST');
  }

  async create(item: Omit<Field, 'id'>): Promise<Field> {
    await this.checkUniqueField(item.collection, item.field);
    const [output] = await this.queryBuilder.insert(item).returning('*');

    return output as Promise<Field>;
  }

  private async checkUniqueField(collection: string, field: string) {
    const fields = await this.read({ collection, field });
    if (fields.length) {
      throw new RecordNotUniqueException('already_registered_name');
    }
  }
}
