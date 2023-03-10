import updateProjectSettingSchema from '../../../../../src/admin/fields/schemas/projectSettings/updateProjectSetting';
import { randomString } from '../../../../utilities/factories';

describe('プロジェクト設定更新', () => {
  test('成功', async () => {
    expect(await updateProjectSettingSchema().isValid({ name: 'example' })).toEqual(true);
  });

  test('name文字数の境界値チェック', async () => {
    expect(await updateProjectSettingSchema().isValid({ name: randomString(100) })).toEqual(true);
    expect(await updateProjectSettingSchema().isValid({ name: randomString(101) })).toEqual(false);
  });
});
