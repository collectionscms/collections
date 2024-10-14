import { Invitation, Role } from '@prisma/client';
import { BypassPrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
import { RoleEntity } from '../role/role.entity.js';
import { InvitationEntity, Status } from './invitation.entity.js';

export class InvitationRepository {
  async findManyByPendingStatus(
    prisma: ProjectPrismaType
  ): Promise<{ invitation: InvitationEntity; role: RoleEntity }[]> {
    const records = await prisma.invitation.findMany({
      where: {
        status: Status.Pending,
      },
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

  async findOneByToken(prisma: BypassPrismaType, token: string): Promise<InvitationEntity | null> {
    const record = await prisma.invitation.findFirst({
      where: {
        token,
      },
    });

    return record ? InvitationEntity.Reconstruct<Invitation, InvitationEntity>(record) : null;
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

  async updateStatus(
    prisma: ProjectPrismaType,
    invitationEntity: InvitationEntity
  ): Promise<InvitationEntity> {
    invitationEntity.beforeUpdateValidate();

    const record = await prisma.invitation.update({
      where: {
        id: invitationEntity.id,
      },
      data: {
        status: invitationEntity.status,
      },
    });

    return InvitationEntity.Reconstruct<Invitation, InvitationEntity>(record);
  }
}
