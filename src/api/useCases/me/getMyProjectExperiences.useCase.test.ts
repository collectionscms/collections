import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { bypassPrisma } from '../../database/prisma/client';
import { defaultValue as defaultValueExperience } from '../../persistence/experience/experience.entity.fixture';
import { defaultValue } from '../../persistence/project/project.entity.fixture.js';
import { InMemoryUserProjectRepository } from '../../persistence/userProject/userProject.repository.mock.js';
import { GetMyProjectExperiencesUseCase } from './getMyProjectExperiences.useCase';

describe('GetMyProjectExperiencesUseCase', () => {
  let getMyProjectExperiencesUseCase: GetMyProjectExperiencesUseCase;

  beforeEach(() => {
    getMyProjectExperiencesUseCase = new GetMyProjectExperiencesUseCase(
      bypassPrisma,
      new InMemoryUserProjectRepository()
    );
    jest.clearAllMocks();
  });

  it('should transform and return project experiences correctly', async () => {
    const result = await getMyProjectExperiencesUseCase.execute({
      userId: v4(),
    });

    expect(result).toMatchObject([
      {
        id: defaultValue.id,
        name: defaultValue.name,
        experiences: [{ name: defaultValueExperience.name, url: defaultValueExperience.url }],
      },
    ]);
  });
});
