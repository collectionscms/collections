import { ProjectPrismaType } from '../../database/prisma/client.js';
import { FileEntity } from './file.entity.js';

export class FileRepository {
  async findFile(prisma: ProjectPrismaType, id: string) {
    const file = await prisma.file.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return FileEntity.Reconstruct(file);
  }

  async upload(prisma: ProjectPrismaType, file: FileEntity): Promise<FileEntity> {
    const uploadedFile = await prisma.file.create({
      data: file.toPersistence(),
    });

    return FileEntity.Reconstruct(uploadedFile);
  }
}
