import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) { }

    public async execute({ name, email, password }: IRequest): Promise<User> {
        const checkIfUserExists = await this.usersRepository.findByEmail(email);

        if (checkIfUserExists) {
            throw new AppError('Email address already used');
        }

        const hashPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashPassword,
        });

        return user;
    }
}

export default CreateUserService;
