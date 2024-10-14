import { File } from '@prisma/client';
import { BypassPrismaClient, ProjectPrismaType } from '../../database/prisma/client.js';
import { FileEntity } from './file.entity.js';

export class FileRepository {
  async findFile(
    prisma: BypassPrismaClient,
    projectId: string | null,
    id: string
  ): Promise<FileEntity | null> {
    const file = await prisma.file.findUnique({
      where: {
        id,
        projectId,
      },
    });

    return file ? FileEntity.Reconstruct<File, FileEntity>(file) : null;
  }

  async create(prisma: ProjectPrismaType, file: FileEntity): Promise<FileEntity> {
    file.beforeInsertValidate();

    const createdFile = await prisma.file.create({
      data: file.toPersistence(),
    });

    return FileEntity.Reconstruct<File, FileEntity>(createdFile);
  }
}
