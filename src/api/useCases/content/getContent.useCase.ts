import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { RevisedContent } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ProjectRepository } from '../../persistence/project/project.repository.js';
import { GetContentUseCaseSchemaType } from './getContent.useCase.schema.js';

export class GetContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly projectRepository: ProjectRepository,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(props: GetContentUseCaseSchemaType): Promise<RevisedContent> {
    const project = await this.projectRepository.findOneById(this.prisma, props.projectId);

    const contentWithRevisions = await this.contentRepository.findOneWithRevisionsById(
      this.prisma,
      props.contentId
    );

    if (!contentWithRevisions) {
      throw new RecordNotFoundException('record_not_found');
    }

    const { content, revisions } = contentWithRevisions;

    const latestRevision = ContentRevisionEntity.getLatestRevisionOfLanguage(
      revisions,
      content.language
    );

    const record = await this.contentRepository.findManyByPostId(this.prisma, content.postId);
    const languageContents = record.map(({ content }) => ({
      contentId: content.id,
      language: content.language,
    }));

    return content.toRevisedContentResponse(project, languageContents, latestRevision, revisions);
  }
}
