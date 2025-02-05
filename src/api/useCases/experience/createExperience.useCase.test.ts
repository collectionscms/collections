import { jest } from '@jest/globals';
import { v4 } from 'uuid';
import { projectPrisma } from '../../database/prisma/client';
import { InMemoryExperienceRepository } from '../../persistence/experience/experience.repository.mock';
import { InMemoryExperienceResourceRepository } from '../../persistence/experienceResource/experienceResource.repository.mock';
import { CreateExperienceUseCase } from './createExperience.useCase';

describe('CreateExperienceUseCase', () => {
  const projectId = v4();
  let createExperienceUseCase: CreateExperienceUseCase;

  const prisma = projectPrisma(projectId);
  jest.spyOn(prisma, '$transaction').mockImplementation(async (fn) => {
    return await fn(prisma);
  });

  beforeEach(() => {
    createExperienceUseCase = new CreateExperienceUseCase(
      projectPrisma(projectId),
      new InMemoryExperienceRepository(),
      new InMemoryExperienceResourceRepository()
    );
    jest.clearAllMocks();
  });

  it('should create experiences and resources correctly', async () => {
    const props = {
      projectId: v4(),
      experiences: [
        { name: 'React', url: 'https://react.dev/', resourceUrls: ['https://example.com'] },
      ],
    };

    const result = await createExperienceUseCase.execute(props);
    expect(result).toMatchObject([
      {
        projectId: props.projectId,
        name: props.experiences[0].name,
        url: props.experiences[0].url,
        resourceUrls: props.experiences[0].resourceUrls,
      },
    ]);
  });
});
