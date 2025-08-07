import { AppDataSource } from "../db/data-source";
import { User } from "../types/types";

const userRepo = AppDataSource.getRepository(User);
//not use direct queries use typeORM commands
export const findUserByIdOrEmail = async (idOrEmail: string) => {
    return await userRepo
        .createQueryBuilder("user")
        .where(`"user"."id"::text = :idOrEmail OR "user"."email" = :idOrEmail`, { idOrEmail })
        .getOne()
}

export const createUser = async (user: User) => {
    const newUser = userRepo.create(user);
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