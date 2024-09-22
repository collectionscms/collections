import { Me } from '../../../types/index.js';
import { BypassPrismaClient } from '../../database/prisma/client.js';
import { UserEntity } from '../../persistence/user/user.entity.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { OAuthSingInUseCaseSchemaType } from './oAuthSignIn.useCase.schema.js';

export class OAuthSignInUseCase {
  constructor(
    private readonly prisma: BypassPrismaClient,
    private readonly userRepository: UserRepository
  ) {}

  async execute({ name, email, provider, providerId }: OAuthSingInUseCaseSchemaType): Promise<Me> {
    const user = await this.userRepository.findOneByProvider(this.prisma, provider, providerId);
    const entity =
      user ||
      UserEntity.Construct({
        name: name,
        email: email,
        isActive: true,
        provider: provider,
        providerId: providerId,
      });

    const result = await this.userRepository.upsert(this.prisma, entity);

    return {
      id: result.id,
      email: result.email,
      provider: result.provider,
      providerId: result.providerId,
    };
  }
}
