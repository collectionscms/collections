import { User } from '@prisma/client';
import { InvalidCredentialsException } from '../../../exceptions/invalidCredentials.js';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';
import { ResetPasswordMailService } from '../../services/resetPasswordMail.service.js';
import { ForgotPasswordUseCaseSchemaType } from './forgotPassword.schema.js';

export class ForgotPasswordUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly userRepository: UserRepository,
    private readonly mailService: ResetPasswordMailService
  ) {}

  async execute(props: ForgotPasswordUseCaseSchemaType): Promise<User> {
    const user = await this.userRepository.findOneByEmail(this.prisma, props.email);
    if (!user) {
      throw new InvalidCredentialsException('unregistered_email_address');
    }

    user.resetPassword();

    const result = await this.userRepository.updateResetPasswordToken(this.prisma, user);
    if (!result.resetPasswordToken) {
      throw new UnexpectedException({ message: 'reset password token is required' });
    }

    this.mailService.sendResetPassword(result.resetPasswordToken, result.email);

    return result.toResponse();
  }
}
