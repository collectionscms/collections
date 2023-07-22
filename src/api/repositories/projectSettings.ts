import { ProjectSetting } from '../../config/types.js';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base.js';

export class ProjectSettingsRepository extends BaseRepository<ProjectSetting> {
  constructor(
    collection: string = 'superfast_project_settings',
    options?: AbstractRepositoryOptions
  ) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): ProjectSettingsRepository {
    const repositoryTransaction = new ProjectSettingsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
