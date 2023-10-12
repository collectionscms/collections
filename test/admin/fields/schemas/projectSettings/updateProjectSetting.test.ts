import { updateProjectSetting } from '../../../../../src/admin/fields/schemas/projectSettings/updateProjectSetting.js';
import { randomString } from '../../../../utilities/factories.js';

describe('Project Settings Update', () => {
  it('success', async () => {
    expect(
      await updateProjectSetting().isValid({
        name: 'example',
        beforeLogin: 'Support Hours 9:00 - 18:00',
        afterLogin: '<a href="#">Contact us</a>',
      })
    ).toEqual(true);
  });

  it('success with required fields only', async () => {
    expect(
      await updateProjectSetting().isValid({
        name: 'example',
      })
    ).toEqual(true);
  });

  it('boundary value check for number of name characters', async () => {
    expect(await updateProjectSetting().isValid({ name: randomString(100) })).toEqual(true);
    expect(await updateProjectSetting().isValid({ name: randomString(101) })).toEqual(false);
  });
});
