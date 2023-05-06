import { File } from '../../config/types.js';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base.js';

export class FilesRepository extends BaseRepository<File> {
  constructor(collection: string = 'superfast_files', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): FilesRepository {
    const repositoryTransaction = new FilesRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
