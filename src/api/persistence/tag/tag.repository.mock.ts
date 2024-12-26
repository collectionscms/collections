import { ProjectPrismaType } from '../../database/prisma/client.js';
import { buildTagEntity } from './tag.entity.fixture.js';
import { TagEntity } from './tag.entity.js';
import { TagRepository } from './tag.repository.js';

export class InMemoryTagRepository extends TagRepository {
  async findOneByName(_prisma: ProjectPrismaType, name: string): Promise<TagEntity | null> {
    return buildTagEntity({ name });
  }
}
