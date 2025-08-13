import { AppDataSource } from "../db/data-source";
import { User } from "../types/types";
import { isUUID } from "class-validator";
import bcrypt from 'bcryptjs';

const userRepo = AppDataSource.getRepository(User);
//here use typeORM commands delete QueryBuilder
export const findUserByIdOrEmail = async (idOrEmail: string) => {
    if (isUUID(idOrEmail)) {
        return await userRepo.findOne({ where: { id: idOrEmail } });
    } else {
        return await userRepo.findOne({ where: { email: idOrEmail } });
    }
}

export const createUser = async (user: User) => { 
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = userRepo.create({ ...user, password: hashedPassword });
    return await userRepo.save(newUser);
}

export const deleteUser = async (id: string) => {
    const user = await userRepo.findOneBy({ id });

    if (!user) {
        return null;
    }

    await userRepo.remove(user);
    
    return user;
}

export const updateUser = async (id: string, data: Partial<User>) => {
   const user = await userRepo.findOneBy({ id });

    if (!user) {
        return null;
    }

    userRepo.merge(user, data);

    return await userRepo.save(user);
}

export const patchUser = updateUser;