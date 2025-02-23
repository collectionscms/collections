import { RevisedContent } from '../../../../types/index.js';
import { ProjectPrismaClient } from '../../../database/prisma/client.js';
import { ContentRepository } from '../../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../../persistence/contentRevision/contentRevision.repository.js';
import { PostEntity } from '../../../persistence/post/post.entity.js';
import { PostRepository } from '../../../persistence/post/post.repository.js';
import { ProjectRepository } from '../../../persistence/project/project.repository.js';
import { CreateContentUseCaseSchemaType } from './createContent.useCase.schema.js';

export class CreateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly projectRepository: ProjectRepository,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository
  ) {}

  async execute(props: CreateContentUseCaseSchemaType): Promise<RevisedContent> {
    const { projectId, userId, sourceLanguage } = props;

    const project = await this.projectRepository.findOneById(this.prisma, props.projectId);

    const { post, content, contentRevision } = PostEntity.Construct({
      projectId,
      createdById: userId,
      language: sourceLanguage,
    });

    post.unsetInit();

    content.updateContent({
      body: props.body,
      bodyJson: props.bodyJson,
      bodyHtml: props.bodyHtml,
      updatedById: userId,
    });

    contentRevision.updateContent({
      body: props.body,
      bodyJson: props.bodyJson,
      bodyHtml: props.bodyHtml,
      updatedById: userId,
    });

    const result = await this.prisma.$transaction(async (tx) => {
      const createdPost = await this.postRepository.create(tx, post);

      const { content: createdContent, createdBy } = await this.contentRepository.create(
        tx,
        content
      );

      await this.contentRevisionRepository.create(tx, contentRevision);

      return {
        post: createdPost,
        content: createdContent,
        createdBy: createdBy,
        updatedBy: createdBy,
        revisions: [contentRevision],
      };
    });

    return result.content.toRevisedContentResponse(
      project,
      [{ contentId: result.content.id, language: result.content.language }],
      result.revisions[0],
      result.revisions
    );
  }
}
