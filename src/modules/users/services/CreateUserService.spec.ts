import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const hashFakeProvider = new FakeHashProvider();
        const createUser = new CreateUserService(fakeUsersRepository, hashFakeProvider);

        const user = await createUser.execute({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123123',
        });

        expect(user).toHaveProperty('id');
    });

    it('should no be able to create a new user if email is already taken', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const hashFakeProvider = new FakeHashProvider();
        const createUser = new CreateUserService(fakeUsersRepository, hashFakeProvider);

        await createUser.execute({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123123',
        });

        expect(createUser.execute({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });
});
