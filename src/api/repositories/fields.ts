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
}
