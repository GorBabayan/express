import { AppDataSource } from "../db/data-source";
import { User } from "../entities/users";
import { isUUID } from "class-validator";
import bcrypt from 'bcryptjs';

const userRepo = AppDataSource.getRepository(User);

export const findUserByIdOrEmail = async (idOrEmail: string): Promise<User | null> => {
    if (isUUID(idOrEmail)) {
        return await userRepo.findOne({ where: { id: idOrEmail } });
    } else {
        return await userRepo.findOne({ where: { email: idOrEmail } });
    }
}

export const createUser = async (user: User): Promise<User> => { 
    const hashedPassword: string = await bcrypt.hash(user.password, 10);
    const newUser: User = userRepo.create({ ...user, password: hashedPassword });
    return await userRepo.save(newUser);
}

export const deleteUser = async (id: string): Promise<User | null> => {
    const user: User | null = await userRepo.findOneBy({ id });

    if (!user) {
        return null;
    }

    await userRepo.remove(user);
    
    return user;
}

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
   const user: User | null = await userRepo.findOneBy({ id });

    if (!user) {
        return null;
    }

    userRepo.merge(user, data);

    return await userRepo.save(user);
}

export const patchUser = updateUser;