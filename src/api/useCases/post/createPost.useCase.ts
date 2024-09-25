import { LocalizedPost } from '../../../types/index.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
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

  async execute(props: CreatePostUseCaseSchemaType): Promise<LocalizedPost> {
    const { userId, projectId, sourceLanguage } = props;

    const project = await this.projectRepository.findOneById(this.prisma, props.projectId);

    const { post, content } = PostEntity.Construct({
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

      const contentRevision = ContentRevisionEntity.Construct({
        ...createdContent.toResponse(),
        contentId: createdContent.id,
      });
      await this.contentRevisionRepository.create(tx, contentRevision);

      return {
        post: createdPost,
        content: createdContent,
        createdBy: createdBy,
        updatedBy: createdBy,
        revisions: [contentRevision],
      };
    });

    return result.post.toLocalizedPostResponse(
      project,
      [result.content.language],
      result.content,
      result.createdBy,
      result.updatedBy,
      result.revisions
    );
  }
}
