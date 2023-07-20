import { loginSchema } from '../../../../../src/admin/fields/schemas/authentications/login.js';

describe('Login Validations', () => {
  it('Success', async () => {
    expect(
      await loginSchema.isValid({ email: 'admin@example.com', password: '************' })
    ).toEqual(true);
  });

  it('Failure (email not entered)', async () => {
    expect(await loginSchema.isValid({ email: '', password: '************' })).toEqual(false);
  });

  it('Failure (password not entered)', async () => {
    expect(await loginSchema.isValid({ email: 'admin@example.com', password: '' })).toEqual(false);
  });

  it('Failure (different email format)', async () => {
    expect(
      await loginSchema.isValid({ email: 'admin/example.com', password: '************' })
    ).toEqual(false);
  });
});
