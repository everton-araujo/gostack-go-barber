import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123456',
        });

        const userToken = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({
            token: userToken.token,
            password: '123123',
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it("shouldn't be able to reset the password with non-existing token", async () => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("shouldn't be able to reset the password with non-existing user", async () => {
        const userToken = await fakeUserTokensRepository.generate('non-existing-user');

        await expect(
            resetPassword.execute({
                token: userToken.token,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("shouldn't be able to reset the password after 2 hours of reset requisition", async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ze',
            email: 'ze@email.com',
            password: '123456',
        });

        const userToken = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementation(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        const response = resetPassword.execute({
            token: userToken.token,
            password: '123123',
        });

        await expect(response).rejects.toBeInstanceOf(AppError);
    });
});
