import e, { NextFunction } from 'express';
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../utils/data-source';
import { Message } from '../entity/message';
import { User } from '../entity/user';9
import AppError from '../utils/appError';

const messageRepository = AppDataSource.getRepository(Message);

export const createMessage = async (
    input: Partial<Message>,
    user: User,
    user_to: User
) => {
    return await messageRepository.save(
        messageRepository.create({
            ...input,
            // user,
            // user_to,
                       
            
        }))
}



export const getMessage = async (
    postId:string
) => {
    return await 
        messageRepository.findOneBy({
            id:postId
        })
}


export const findMessage = async (
    where: FindOptionsWhere<Message> = {},
    select: FindOptionsSelect<Message> = {},
    relations: FindOptionsRelations<Message> = {}
  ) => {
    return await messageRepository.find({
      where,
      select,
      relations,
    });
}