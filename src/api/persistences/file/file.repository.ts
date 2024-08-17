import { File } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { FileEntity } from './file.entity.js';

export class FileRepository {
  async findFile(prisma: ProjectPrismaType, id: string) {
    const file = await prisma.file.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return FileEntity.Reconstruct<File, FileEntity>(file);
  }

  async create(prisma: ProjectPrismaType, file: FileEntity): Promise<FileEntity> {
    const createdFile = await prisma.file.create({
      data: file.toPersistence(),
    });

    return FileEntity.Reconstruct<File, FileEntity>(createdFile);
  }
}
