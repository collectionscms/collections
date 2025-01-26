import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { UpdateContentUseCaseSchemaType } from './updateContent.useCase.schema.js';
import { PostRepository } from '../../persistence/post/post.repository.js';

export class UpdateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly postRepository: PostRepository
  ) {}

  async execute(props: UpdateContentUseCaseSchemaType): Promise<Content> {
    const revision = await this.contentRevisionRepository.findLatestOneByContentId(
      this.prisma,
      props.id
    );

    if (!revision) {
      throw new RecordNotFoundException('record_not_found');
    }

    revision.updateContent({
      coverUrl: props.coverUrl,
      title: props.title,
      subtitle: props.subtitle,
      body: props.body,
      bodyJson: props.bodyJson,
      bodyHtml: props.bodyHtml,
      slug: props.slug,
      updatedById: props.userId,
      metaTitle: props.metaTitle,
      metaDescription: props.metaDescription,
    });

    const post = await this.postRepository.findOneById(this.prisma, revision.postId);

    const createdOrUpdatedRevision = await this.prisma.$transaction(async (tx) => {
      if (post?.isInit) {
        post.unsetInit();
        await this.postRepository.update(tx, post);
      }

      if (revision.isPublished()) {
        // create new version revision
        const contentRevision = ContentRevisionEntity.Construct({
          ...revision.toResponse(),
          version: revision.version + 1,
        });
        return await this.contentRevisionRepository.create(tx, contentRevision);
      } else {
        // update current revision
        return await this.contentRevisionRepository.update(tx, revision);
      }
    });

    return createdOrUpdatedRevision.toContentResponse();
  }
}
