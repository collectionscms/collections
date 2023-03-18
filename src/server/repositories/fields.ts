import { Field } from '../../shared/types';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';

export class FieldsRepository extends BaseRepository<Field> {
  constructor(options?: AbstractRepositoryOptions) {
    super('superfast_fields', options);
  }

  transacting(trx: BaseTransaction): FieldsRepository {
    const repositoryTransaction = new FieldsRepository({
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  deleteAll(data: Partial<Field>): Promise<boolean> {
    return this.queryBuilder.where(data).delete();
  }
}
