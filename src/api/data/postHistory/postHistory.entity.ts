import { PostHistory } from '@prisma/client';
import { v4 } from 'uuid';

export class PostHistoryEntity {
  private readonly postHistory: PostHistory;

  constructor(postHistory: PostHistory) {
    this.postHistory = postHistory;
  }

  static Construct({
    postId,
    createdById,
    status,
    version,
  }: {
    postId: string;
    createdById: string;
    status: string;
    version: number;
  }): PostHistoryEntity {
    return new PostHistoryEntity({
      id: v4(),
      postId,
      createdById,
      status,
      version,
      createdAt: new Date(),
    });
  }

  static Reconstruct(postHistory: PostHistory): PostHistoryEntity {
    return new PostHistoryEntity(postHistory);
  }

  private copyProps(): PostHistory {
    const copy = {
      ...this.postHistory,
    };
    return Object.freeze(copy);
  }

  toPersistence(): PostHistory {
    return this.copyProps();
  }
}
