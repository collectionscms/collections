import { Permission } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class PermissionsService extends BaseService<Permission> {
  constructor(options: AbstractServiceOptions) {
    super('CollectionsPermissions', options);
  }
}
