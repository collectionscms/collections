import { ProjectSetting } from '../../shared/types';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';

export class ProjectSettingsRepository extends BaseRepository<ProjectSetting> {
  constructor(options?: AbstractRepositoryOptions) {
    super('superfast_project_settings', options);
  }

  transacting(trx: BaseTransaction): ProjectSettingsRepository {
    const repositoryTransaction = new ProjectSettingsRepository({
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
