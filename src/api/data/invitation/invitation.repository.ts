import { Invitation } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { InvitationEntity } from './invitation.entity.js';

export class InvitationRepository {
  async findManyByPendingStatus(prisma: ProjectPrismaType): Promise<InvitationEntity[]> {
    const records = await prisma.invitation.findMany({});

    return records.map((record) => {
      return InvitationEntity.Reconstruct<Invitation, InvitationEntity>(record);
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
