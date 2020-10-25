import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProviderService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository;
        listProviders = new ListProvidersService(fakeUsersRepository);
    });

    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'Example',
            email: 'example@email.com',
            password: 'abcabc',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john_doe@email.com',
            password: 'abcdef',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123456',
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
