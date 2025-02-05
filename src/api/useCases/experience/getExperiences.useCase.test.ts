import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client';
import { defaultValue } from '../../persistence/experience/experience.entity.fixture';
import { InMemoryExperienceRepository } from '../../persistence/experience/experience.repository.mock';
import { defaultValue as defaultValueResource } from '../../persistence/experienceResource/experienceResource.entity.fixture';
import { GetExperiencesUseCase } from './getExperiences.useCase';

describe('GetExperiencesUseCase', () => {
  const projectId = v4();
  let getExperiencesUseCase: GetExperiencesUseCase;

  beforeEach(() => {
    getExperiencesUseCase = new GetExperiencesUseCase(
      projectPrisma(projectId),
      new InMemoryExperienceRepository()
    );
    jest.clearAllMocks();
  });

  it('should successfully retrieve experience data', async () => {
    const result = await getExperiencesUseCase.execute();

    expect(result).toMatchObject([
      {
        id: defaultValue.id,
        name: defaultValue.name,
        projectId: defaultValue.projectId,
        resourceUrls: [defaultValueResource.url],
      },
    ]);
  });
});
