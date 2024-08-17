import { InvalidTokenException } from '../../../exceptions/invalidToken.js';
import { Me } from '../../../types/index.js';
import { InvitationRepository } from '../../persistences/invitation/invitation.repository.js';
import { UserEntity } from '../../persistences/user/user.entity.js';
import { UserRepository } from '../../persistences/user/user.repository.js';
import { UserProjectEntity } from '../../persistences/userProject/userProject.entity.js';
import { UserProjectRepository } from '../../persistences/userProject/userProject.repository.js';
import { BypassPrismaClient } from '../../database/prisma/client.js';
import { SignUpMailService } from '../../services/signUpMail.service.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { SignUpUseCaseSchemaType } from './signUp.schema.js';

export class SignUpUseCase {
  constructor(
    private readonly prisma: BypassPrismaClient,
    private readonly userRepository: UserRepository,
    private readonly invitationRepository: InvitationRepository,
    private readonly userProjectRepository: UserProjectRepository,
    private readonly mailService: SignUpMailService
  ) {}

  async execute(props: SignUpUseCaseSchemaType): Promise<Me> {
    await this.userRepository.checkUniqueEmail(this.prisma, props.email);
    const hashed = await oneWayHash(props.password);

    const user = await this.userRepository.findOneByEmail(this.prisma, props.email);
    const entity =
      user ||
      UserEntity.Construct({
        name: props.email,
        email: props.email,
        password: hashed,
        isActive: false,
      });
    entity.generateConfirmationToken();

    const invitation = props.token
      ? await this.invitationRepository.findOneByToken(this.prisma, props.token)
      : null;
    if (invitation && (invitation.email !== props.email || invitation.isAccepted())) {
      throw new InvalidTokenException();
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await this.userRepository.upsert(tx, entity);

      // with accept invitation
      if (invitation) {
        const entity = UserProjectEntity.Construct({
          userId: user.id,
          projectId: invitation.projectId,
          roleId: invitation.roleId,
        });

        await this.userProjectRepository.create(tx, entity);

        invitation.acceptInvitation();
        await this.invitationRepository.updateStatus(tx, invitation);
      }

      return user;
    });

    // send email
    await this.mailService.sendVerify(result);

    return {
      id: result.id,
      email: result.email,
    };
  }
}
