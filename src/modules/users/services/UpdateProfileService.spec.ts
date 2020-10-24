import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123123',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Zezinho',
            email: 'zezinho@email.com',
        });

        expect(updatedUser.name).toBe('Zezinho');
        expect(updatedUser.email).toBe('zezinho@email.com');
    });

    it("shouldn't be able to update using an email already in use by another profile", async () => {
        await fakeUsersRepository.create({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123123',
        });

        const user = await fakeUsersRepository.create({
            name: 'Teste',
            email: 'teste@email.com',
            password: '123123',
        });

        // await expect(
        //     updateProfile.execute({
        //         user_id: user.id,
        //         name: 'Ze',
        //         email: 'ze@email.com',
        //     }),
        // ).rejects.toBeInstanceOf(AppError);

        const response = updateProfile.execute({
            user_id: user.id,
            name: 'Ze',
            email: 'ze@email.com',
        });

        await expect(response).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Zezinho',
            email: 'zezinho@email.com',
            old_password: '123456',
            new_password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123456',
        });

        const response = updateProfile.execute({
            user_id: user.id,
            name: 'Zezinho',
            email: 'zezinho@email.com',
            new_password: '123123',
        });

        await expect(response).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123456',
        });

        const response = updateProfile.execute({
            user_id: user.id,
            name: 'Zezinho',
            email: 'zezinho@email.com',
            old_password: 'wrong-old-password',
            new_password: '123123',
        });

        await expect(response).rejects.toBeInstanceOf(AppError);
    });
});
