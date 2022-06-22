import config from "config";
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations } from "typeorm";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/product";
import { User } from "../entity/user";
import { CreateUserInput } from "../schemas/user";
import redisClient from "../utils/connectRedis";
import { signJwt } from "../utils/jwt";


const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: CreateUserInput) => {
    return (await AppDataSource.manager.save(
        AppDataSource.manager.create(User, input)
    )) as User;
};

export const findUserByEmail = async ({ email }: { email: string }) => {
    return await userRepository.findOneBy({ email });
};

export const findUserById = async (userId: string) => {
    return await userRepository.findOneBy({ id: userId,  });
};

export const findUser = async (query: Object) => {
    return await userRepository.findOneBy(query);
};

export const findUsers = async (
    where: FindOptionsWhere<User> = {},
    select: FindOptionsSelect<User> = {},
    relations: FindOptionsRelations<User> = {}
  ) => {
    return await userRepository.find({
      where,
      select,
      relations:{
        products:true,
        // message:true,
        orders:true
      },
    });
        // return await userRepository
        // .createQueryBuilder("user")
        // .leftJoinAndSelect("user.products", "products")
        // .getMany()
}

// 👇 Sign access and Refresh Tokens
export const signTokens = async (user: User) => {
    // 1. Create Session
    redisClient.set(user.id, JSON.stringify(user), {
        EX: config.get<number>('redisCacheExpiresIn') * 60,
    });

    // 2. Create Access and Refresh tokens
    const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
        expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    const refresh_token = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
        expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
    });

    return { access_token, refresh_token };
};
