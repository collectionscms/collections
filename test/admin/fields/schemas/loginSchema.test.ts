import loginSchema from '../../../../src/admin/fields/schemas/loginSchema';

describe('ログインバリデーション', () => {
  test('成功', async () => {
    expect(
      await loginSchema.isValid({ email: 'admin@example.com', password: '************' })
    ).toEqual(true);
  });

  test('失敗（emailが未入力）', async () => {
    expect(await loginSchema.isValid({ email: '', password: '************' })).toEqual(false);
  });

  test('失敗（passwordが未入力）', async () => {
    expect(await loginSchema.isValid({ email: 'admin@example.com', password: '' })).toEqual(false);
  });

  test('失敗（email形式違い）', async () => {
    expect(
      await loginSchema.isValid({ email: 'admin/example.com', password: '************' })
    ).toEqual(false);
  });
});
