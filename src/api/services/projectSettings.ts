import { ProjectSetting } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class ProjectSettingsService extends BaseService<ProjectSetting> {
  constructor(options: AbstractServiceOptions) {
    super('CollectionsProjectSettings', options);
  }
}
