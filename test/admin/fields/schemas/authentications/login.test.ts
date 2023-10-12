import { loginSchema } from '../../../../../src/admin/fields/schemas/authentications/login.js';

describe('Login Validations', () => {
  it('success', async () => {
    expect(
      await loginSchema.isValid({
        email: 'admin@example.com',
        password: '************',
        app_access: true,
      })
    ).toEqual(true);
  });

  it('failure (email not entered)', async () => {
    expect(
      await loginSchema.isValid({ email: '', password: '************', app_access: true })
    ).toEqual(false);
  });

  it('failure (password not entered)', async () => {
    expect(
      await loginSchema.isValid({ email: 'admin@example.com', password: '', app_access: true })
    ).toEqual(false);
  });

  it('failure (different email format)', async () => {
    expect(
      await loginSchema.isValid({
        email: 'admin/example.com',
        password: '************',
        app_access: true,
      })
    ).toEqual(false);
  });
});
