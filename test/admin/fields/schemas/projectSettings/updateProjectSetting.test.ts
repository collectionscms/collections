import { updateProjectSetting } from '../../../../../src/admin/fields/schemas/projectSettings/updateProjectSetting.js';
import { randomString } from '../../../../utilities/factories.js';

describe('プロジェクト設定更新', () => {
  test('成功', async () => {
    expect(await updateProjectSetting().isValid({ name: 'example' })).toEqual(true);
  });

  test('name文字数の境界値チェック', async () => {
    expect(await updateProjectSetting().isValid({ name: randomString(100) })).toEqual(true);
    expect(await updateProjectSetting().isValid({ name: randomString(101) })).toEqual(false);
  });
});
