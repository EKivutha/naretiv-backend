import e, { NextFunction } from 'express';
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Product } from '../entity/product';
import { User } from '../entity/user';
import AppError from '../utils/appError';

const productRepository = AppDataSource.getRepository(Product);

export const createProduct = async (
    input: Partial<Product>,
    user: User
) => {
    return await productRepository.save(
        productRepository.create({
            ...input,
            user
        }))
}


export const findProductById = async (productId: string) => {
    return await productRepository.findOneBy({ id: productId,  });
};


export const getProduct = async (
    postId:string
) => {
    return await 
        productRepository.findOneBy({
            id:postId
        })
}


export const findProduct = async (
    where: FindOptionsWhere<Product> = {},
    select: FindOptionsSelect<Product> = {},
    relations: FindOptionsRelations<Product> = {}
  ) => {
    return await productRepository.find({
      where,
      select,
      relations,
    });
}