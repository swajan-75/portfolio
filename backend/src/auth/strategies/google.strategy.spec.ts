import { GoogleStrategy } from './google.strategy';
import { GoogleProfileInvalidException } from '../../common/exceptions/auth.exceptions';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;

  beforeEach(() => {
    strategy = new GoogleStrategy();
  });

  it('resolves the primary email for a well-formed profile', async () => {
    const done = jest.fn();
    const profile = {
      id: 'google-id-1',
      emails: [{ value: 'admin@example.com' }],
    };

    await strategy.validate('access-token', 'refresh-token', profile, done);

    expect(done).toHaveBeenCalledWith(null, {
      googleId: 'google-id-1',
      email: 'admin@example.com',
      accessToken: 'access-token',
    });
  });

  it('throws GoogleProfileInvalidException instead of an unhandled TypeError when emails is missing', async () => {
    const done = jest.fn();
    const profile = { id: 'google-id-1' };

    await expect(
      strategy.validate('access-token', 'refresh-token', profile, done),
    ).rejects.toBeInstanceOf(GoogleProfileInvalidException);
    expect(done).not.toHaveBeenCalled();
  });

  it('throws GoogleProfileInvalidException when emails is an empty array', async () => {
    const done = jest.fn();
    const profile = { id: 'google-id-1', emails: [] };

    await expect(
      strategy.validate('access-token', 'refresh-token', profile, done),
    ).rejects.toBeInstanceOf(GoogleProfileInvalidException);
  });
});
