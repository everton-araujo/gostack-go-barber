import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
    });

    it('should be able to authenticate', async () => {
        const user = await fakeUsersRepository.create({
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
        const response = authenticateUser.execute({
            email: 'zezinho@email.com',
            password: '123123',
        });

        await expect(response).rejects.toBeInstanceOf(AppError);
    });

    it("shouldn't be able to authenticate with wrong password", async () => {
        await fakeUsersRepository.create({
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
