import { ProjectSetting } from '../../shared/types';
import { AbstractRepositoryOptions, BaseRepository } from './base';

export class ProjectSettingsRepository extends BaseRepository<ProjectSetting> {
  constructor(options: AbstractRepositoryOptions) {
    super('superfast_project_settings', options);
  }
}
