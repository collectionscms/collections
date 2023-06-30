import { loginSchema } from '../../../../../src/admin/fields/schemas/authentications/login.js';

describe('Login Validations', () => {
  test('Success', async () => {
    expect(
      await loginSchema.isValid({ email: 'admin@example.com', password: '************' })
    ).toEqual(true);
  });

  test('Failure (email not entered)', async () => {
    expect(await loginSchema.isValid({ email: '', password: '************' })).toEqual(false);
  });

  test('Failure (password not entered)', async () => {
    expect(await loginSchema.isValid({ email: 'admin@example.com', password: '' })).toEqual(false);
  });

  test('Failure (different email format)', async () => {
    expect(
      await loginSchema.isValid({ email: 'admin/example.com', password: '************' })
    ).toEqual(false);
  });
});
