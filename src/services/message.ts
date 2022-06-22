import e, { NextFunction } from 'express';
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Message } from '../entity/message';
import { User } from '../entity/user';
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
            user_to,
            user           
            
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