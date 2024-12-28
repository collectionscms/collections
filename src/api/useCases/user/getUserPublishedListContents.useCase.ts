import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { PublishedListContent } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { UserProjectRepository } from '../../persistence/userProject/userProject.repository.js';
import { GetUserPublishedListContentsUseCaseSchemaType } from './getUserPublishedListContents.useCase.schema.js';

export class GetUserPublishedListContentsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly userProjectRepository: UserProjectRepository,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute({
    userId,
  }: GetUserPublishedListContentsUseCaseSchemaType): Promise<PublishedListContent[]> {
    const userProject = await this.userProjectRepository.findOneWithRoleByUserId(
      this.prisma,
      userId
    );

    if (!userProject) {
      throw new RecordNotFoundException('record_not_found');
    }

    const contents = await this.contentRepository.findPublishedContentsByCreatedById(
      this.prisma,
      userProject.user.id
    );

    return contents.map((content) => content.toPublishedListContentResponse(userProject.user));
  }
}
