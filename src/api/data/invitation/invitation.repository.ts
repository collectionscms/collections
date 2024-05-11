import { Invitation, Role } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { InvitationEntity } from './invitation.entity.js';
import { RoleEntity } from '../role/role.entity.js';

export class InvitationRepository {
  async findManyByPendingStatus(
    prisma: ProjectPrismaType
  ): Promise<{ invitation: InvitationEntity; role: RoleEntity }[]> {
    const records = await prisma.invitation.findMany({
      include: {
        role: true,
      },
    });

    return records.map((record) => {
      return {
        invitation: InvitationEntity.Reconstruct<Invitation, InvitationEntity>(record),
        role: RoleEntity.Reconstruct<Role, RoleEntity>(record.role),
      };
    });
  }

  async create(
    prisma: ProjectPrismaType,
    invitationEntity: InvitationEntity
  ): Promise<InvitationEntity> {
    invitationEntity.beforeInsertValidate();

    const record = await prisma.invitation.create({
      data: invitationEntity.toPersistence(),
    });

    return InvitationEntity.Reconstruct<Invitation, InvitationEntity>(record);
  }
}
