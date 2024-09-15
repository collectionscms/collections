import { loginValidator } from './login.validator.js';

describe('Login Validations', () => {
  it('success', async () => {
    expect(
      await loginValidator.isValid({
        email: 'admin@example.com',
        password: '************',
        csrfToken: '************',
      })
    ).toEqual(true);
  });

  it('failure (email not entered)', async () => {
    expect(
      await loginValidator.isValid({
        email: '',
        password: '************',
        csrfToken: '************',
      })
    ).toEqual(false);
  });

  it('failure (password not entered)', async () => {
    expect(
      await loginValidator.isValid({
        email: 'admin@example.com',
        password: '',
        csrfToken: '************',
      })
    ).toEqual(false);
  });

  it('failure (different email format)', async () => {
    expect(
      await loginValidator.isValid({
        email: 'admin/example.com',
        password: '************',
        csrfToken: '************',
      })
    ).toEqual(false);
  });
});
