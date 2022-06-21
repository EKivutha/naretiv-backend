import { NextFunction, Request, Response } from 'express';
import {
    CreateProductInput,
    DeleteProductInput,
    GetProductInput,
    UpdateProductInput,
} from '../schemas/product';
import { createProduct, findProduct, getProduct } from '../services/product';
import { findUserById } from '../services/user';
import AppError from '../utils/appError';

// 👈 Product method:- Create a new Product
export const createProductHandler = async (
    req: Request<{}, {}, CreateProductInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await findUserById(res.locals.user.id as string);

        if (user!.role == 'seller') {
            try {
                const Product = await createProduct(req.body, user!);

                res.status(201).json({
                    status: 'success',
                    data: {
                        Product,
                    },
                });
            } catch (err: any) {
                if (err.code === '23505') {
                    return res.status(409).json({
                        status: 'fail',
                        message: 'Product with that title already exist',
                    });
                }
                next(err);
            }

        } else {
            return next(new AppError(401, 'User is not authorized to create product'));
        }
    } catch (err: any) {
        if (err.code === '23505') {
            return res.status(409).json({
                status: 'fail',
                message: 'Could not create product',
            });
        }
        next(err);

    }
};

export const getProductHandler = async (
    req: Request<GetProductInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await findUserById(res.locals.user.id as string);

        if (user!.role == 'admin') {
            const product = await getProduct(req.params.ProductId)

            if (!product) {
                return next(new AppError(404, 'Product with that id not found'))
            }
            res.status(200).json({
                status: 'success',
                data: {
                    product,
                },

            })
        }
        else{
            return next(new AppError(401, 'User is not allowed to get product list')); 
        }
    }
    catch (err: any) {
        next(err);
    }
}

export const getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const products = await findProduct({}, {}, {});

        res.status(200).json({
            status: 'success',
            data: {
                products
            }
        })
    } catch (err: any) {
        next(err);
    }
}

export const updateProductHandler = async (
    req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
    res: Response,
    next: NextFunction
) => {
    try {
        const Product = await getProduct(req.params.ProductId);

        if (!Product) {
            return next(new AppError(404, 'Product with that ID not found'));
        }

        Object.assign(Product, req.body);

        const updatedProduct = await Product.save();

        res.status(200).json({
            status: 'success',
            data: {
                Product: updatedProduct,
            },
        });
    } catch (err: any) {
        next(err);
    }
};


export const deleteProductHandler = async (
    req: Request<DeleteProductInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const Product = await getProduct(req.params.ProductId);

        if (!Product) {
            return next(new AppError(404, 'Product with that ID not found'));
        }

        await Product.remove();

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err: any) {
        next(err);
    }
};
