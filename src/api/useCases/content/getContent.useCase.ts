import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { LocalizedContent } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentHistoryRepository } from '../../persistence/contentHistory/contentHistory.repository.js';
import { ProjectRepository } from '../../persistence/project/project.repository.js';
import { GetContentUseCaseSchemaType } from './getContent.schema.js';

export class GetContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly projectRepository: ProjectRepository,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(
    props: GetContentUseCaseSchemaType,
    hasReadAllPost: boolean
  ): Promise<LocalizedContent> {
    const options = hasReadAllPost ? undefined : { userId: props.userId };
    const record = await this.contentRepository.findOneWithUserById(
      this.prisma,
      props.contentId,
      options
    );

    if (!record) {
      throw new RecordNotFoundException('record_not_found');
    }

    const contents = await this.contentRepository.findManyByPostId(
      this.prisma,
      record.content.postId
    );
    const usedLanguages = ContentEntity.usedLanguages(contents);

    const histories = await this.contentHistoryRepository.findManyByPostIdWithLanguage(
      this.prisma,
      record.content.postId,
      record.content.language
    );

    const project = await this.projectRepository.findOneById(this.prisma, props.projectId);

    return record.content.toLocalizedContentResponse(
      project,
      usedLanguages,
      record.createdBy,
      record.updatedBy,
      histories
    );
  }
}
