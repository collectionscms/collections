import { Content } from '@prisma/client';
import { contentStatus } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { PostHistoryRepository } from '../../data/postHistory/postHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { PublishUseCaseSchemaType } from './publish.schema.js';

export class PublishUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly postHistoryRepository: PostHistoryRepository
  ) {}

  async execute(props: PublishUseCaseSchemaType): Promise<Content> {
    const { projectId, id, userId } = props;

    const content = await this.contentRepository.findOneById(this.prisma, id);
    content.changeStatus(contentStatus.published);

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.updateStatus(tx, content);

      // await this.postHistoryRepository.create(
      //   tx,
      //   PostHistoryEntity.Construct({
      //     projectId: projectId,
      //     postId: id,
      //     userId,
      //     status: entity.status,
      //     version: entity.version,
      //   })
      // );

      return result;
    });

    return updatedContent.toResponse();
  }
}
