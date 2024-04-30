import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { PostRepository } from '../data/post/post.repository.js';
import { PostHistoryRepository } from '../data/postHistory/postHistory.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { changeStatusUseCaseSchema } from '../useCases/post/changeStatus.schema.js';
import { ChangeStatusUseCase } from '../useCases/post/changeStatus.useCase.js';
import { CreatePostUseCase } from '../useCases/post/createPost.useCase.js';
import { deletePostUseCaseSchema } from '../useCases/post/deletePost.schema.js';
import { DeletePostUseCase } from '../useCases/post/deletePost.useCase.js';
import { updatePostUseCaseSchema } from '../useCases/post/updatePost.schema.js';
import { UpdatePostUseCase } from '../useCases/post/updatePost.useCase.js';

const router = express.Router();

router.get(
  '/posts',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;
    const projectId = res.user.projects[0].id;

    const repository = new PostRepository();
    const records = await repository.findManyByProjectId(projectPrisma(projectId));

    const posts = records.map((record) => {
      return record.post.toResponse(locale, record.contents, record.histories, record.createdBy);
    });

    res.json({ posts });
  })
);

router.get(
  '/posts/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;
    const id = req.params.id;
    const projectId = req.res?.user.projects[0].id;

    if (!projectId || !id) {
      throw new InvalidPayloadException('bad_request');
    }

    const repository = new PostRepository();
    const record = await repository.findOneWithContentsById(
      projectPrisma(projectId),
      projectId,
      id
    );
    const post = record.post.toResponse(
      locale,
      record.contents,
      record.histories,
      record.createdBy
    );

    res.json({
      post,
    });
  })
);

router.post(
  '/posts',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;
    const projectId = req.res?.user.projects[0].id;
    const userId = req.res?.user.id;

    // todo validate request body
    if (!projectId || !userId) {
      throw new InvalidPayloadException('bad_request');
    }

    const useCase = new CreatePostUseCase(
      projectPrisma(projectId),
      new PostRepository(),
      new ContentRepository()
    );
    const result = await useCase.execute(projectId, userId, locale);
    const post = result.post.toResponse(locale, result.contents, [], result.createdBy);

    res.json({
      post,
    });
  })
);

router.patch(
  '/posts/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = res.user.projects[0].id;
    const name = req.res?.user.name;
    const id = req.params.id;

    const validated = updatePostUseCaseSchema.safeParse({
      id,
      name,
      projectId,
      ...req.body,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdatePostUseCase(
      projectPrisma(projectId),
      new PostRepository(),
      new PostHistoryRepository()
    );
    await useCase.execute(
      validated.data.projectId,
      validated.data.name,
      validated.data.id,
      req.body
    );

    res.status(204).send();
  })
);

router.delete(
  '/posts/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = res.user.projects[0].id;
    const id = req.params.id;

    const validated = deletePostUseCaseSchema.safeParse({
      id,
      projectId,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new DeletePostUseCase(projectPrisma(projectId), new PostRepository());
    await useCase.execute(validated.data.projectId, validated.data.id);

    res.status(204).send();
  })
);

router.patch(
  '/posts/:id/changeStatus',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const projectId = res.user.projects[0].id;
    const userName = req.res?.user.name;

    const validated = changeStatusUseCaseSchema.safeParse({
      projectId,
      id,
      userName,
      ...req.body,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new ChangeStatusUseCase(
      projectPrisma(projectId),
      new PostRepository(),
      new PostHistoryRepository()
    );

    await useCase.execute(validated.data.id, validated.data.projectId, validated.data.userName, {
      status: validated.data.status,
    });

    res.status(204).send();
  })
);

export const post = router;
