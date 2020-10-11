import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    constructor(private usersRepository: IUserRepository) { }

    public async execute({ name, email, password }: IRequest): Promise<User> {
        const checkIfUserExists = await this.usersRepository.findByEmail(email);

        if (checkIfUserExists) {
            throw new AppError('Email address already used');
        }

        const hashPassword = await hash(password, 8);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashPassword,
        });

        return user;
    }
}

export default CreateUserService;
