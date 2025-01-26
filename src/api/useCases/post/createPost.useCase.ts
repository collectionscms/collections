import { RevisedContent } from '../../../types/index.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { PostEntity } from '../../persistence/post/post.entity.js';
import { PostRepository } from '../../persistence/post/post.repository.js';
import { ProjectRepository } from '../../persistence/project/project.repository.js';
import { CreatePostUseCaseSchemaType } from './createPost.useCase.schema.js';

export class CreatePostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly projectRepository: ProjectRepository,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository
  ) {}

  async execute(props: CreatePostUseCaseSchemaType): Promise<RevisedContent> {
    const { userId, projectId, sourceLanguage } = props;

    const project = await this.projectRepository.findOneById(this.prisma, props.projectId);

    // find isInit post
    const initPost = await this.postRepository.findOneByIsInit(this.prisma);
    if (initPost) {
      return initPost.content.toRevisedContentResponse(
        project,
        [{ contentId: initPost.content.id, language: initPost.content.language }],
        initPost.revision,
        [initPost.revision]
      );
    }

    const { post, content, contentRevision } = PostEntity.Construct({
      projectId: projectId,
      language: sourceLanguage,
      createdById: userId,
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
