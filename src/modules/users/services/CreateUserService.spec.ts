import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider
        );
    });

    it('should be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123123',
        });

        expect(user).toHaveProperty('id');
    });

    it('should no be able to create a new user if email is already taken', async () => {
        await createUser.execute({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123123',
        });

        await expect(createUser.execute({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });
});
