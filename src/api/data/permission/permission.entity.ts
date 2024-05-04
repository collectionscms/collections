import { Permission } from '@prisma/client';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class PermissionEntity extends PrismaBaseEntity<Permission> {}
