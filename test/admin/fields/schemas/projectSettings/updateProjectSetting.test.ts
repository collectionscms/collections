import { updateProjectSetting } from '../../../../../src/admin/fields/schemas/projectSettings/updateProjectSetting.js';
import { randomString } from '../../../../utilities/factories.js';

describe('Project Settings Update', () => {
  test('Success', async () => {
    expect(await updateProjectSetting().isValid({ name: 'example' })).toEqual(true);
  });

  test('Boundary value check for number of name characters', async () => {
    expect(await updateProjectSetting().isValid({ name: randomString(100) })).toEqual(true);
    expect(await updateProjectSetting().isValid({ name: randomString(101) })).toEqual(false);
  });
});
