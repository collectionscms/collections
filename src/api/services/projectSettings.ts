import { ProjectSetting } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class ProjectSettingsService extends BaseService<ProjectSetting> {
  constructor(options: AbstractServiceOptions) {
    super('collections_project_settings', options);
  }
}
