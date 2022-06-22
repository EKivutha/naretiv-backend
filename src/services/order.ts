import e, { NextFunction } from 'express';
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Order } from '../entity/order';
import { Product } from '../entity/product';
import { User } from '../entity/user';
import AppError from '../utils/appError';

const orderRepository = AppDataSource.getRepository(Order);

export const createOrder = async (
    input: Partial<Order>,
    user: User,
    product: Product
) => {
    return await orderRepository.save(
        orderRepository.create({
            ...input,
            user,
            product
        }))
}


export const getOrder = async (
    postId:string
) => {
    return await 
        orderRepository.findOneBy({
            id:postId
        })
}


export const findOrder = async (
    where: FindOptionsWhere<Order> = {},
    select: FindOptionsSelect<Order> = {},
    relations: FindOptionsRelations<Order> = {}
  ) => {
    return await orderRepository.find({
      where,
      select,
      relations,
    });
}