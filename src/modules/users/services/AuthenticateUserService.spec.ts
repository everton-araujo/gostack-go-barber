import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUser.execute({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123123',
        });

        const response = await authenticateUser.execute({
            email: 'ze@email.com',
            password: '123123',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it("shouldn't be able to authenticate a invalid user", async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        const response = authenticateUser.execute({
            email: 'zezinho@email.com',
            password: '123123',
        });

        await expect(response).rejects.toBeInstanceOf(AppError);
    });

    it("shouldn't be able to authenticate with wrong password", async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        await createUser.execute({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123123',
        });

        const response = authenticateUser.execute({
            email: 'ze@email.com',
            password: 'abcabc',
        });

        await expect(response).rejects.toBeInstanceOf(AppError);
    });
});
