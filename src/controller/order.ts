import { NextFunction, Request, Response } from 'express';
import {
    CreateOrderInput,
    DeleteOrderInput,
    GetOrderInput,
    UpdateOrderInput,
} from '../schemas/order';
import { createOrder, findOrder, getOrder } from '../services/order';
import { findProduct, findProductById } from '../services/product';
import { findUserById } from '../services/user';
import AppError from '../utils/appError';

// 👈 Order method:- Create a new Order
export const createOrderHandler = async (
    req: Request<{}, {}, CreateOrderInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await findUserById(res.locals.user.id as string);
        const product = await findProductById(req.body.product_id)

        if (user!.role == 'buyer' || user!.role == 'admin') {
            try {
                const Order = await createOrder(req.body, user!, product!);

                res.status(201).json({
                    status: 'success',
                    data: {
                        Order,
                    },
                });
            } catch (err: any) {
                if (err.code === '23505') {
                    return res.status(409).json({
                        status: 'fail',
                        message: 'Order with that title already exist',
                    });
                }
                next(err);
            }

        } else {
            return next(new AppError(401, 'User is not authorized to create Order'));
        }
    } catch (err: any) {
        if (err.code === '23505') {
            return res.status(409).json({
                status: 'fail',
                message: 'Could not create Order',
            });
        }
        next(err);

    }
};

export const getOrderHandler = async (
    req: Request<GetOrderInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await findUserById(res.locals.user.id as string);

        if (user!.role == 'admin') {
            const Order = await getOrder(req.params.OrderId)

            if (!Order) {
                return next(new AppError(404, 'Order with that id not found'))
            }
            res.status(200).json({
                status: 'success',
                data: {
                    Order,
                },

            })
        }
        else {
            return next(
                new AppError(
                    401, 'User is not allowed to get Order list'
                )
            );
        }
    }
    catch (err: any) {
        next(err);
    }
}

export const getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const Orders = await findOrder({}, {}, {});

        res.status(200).json({
            status: 'success',
            data: {
                Orders
            }
        })
    } catch (err: any) {
        next(err);
    }
}

export const updateOrderHandler = async (
    req: Request<UpdateOrderInput['params'], {}, UpdateOrderInput['body']>,
    res: Response,
    next: NextFunction
) => {
    try {
        const Order = await getOrder(req.params.OrderId);

        if (!Order) {
            return next(new AppError(404, 'Order with that ID not found'));
        }

        Object.assign(Order, req.body);

        const updatedOrder = await Order.save();

        res.status(200).json({
            status: 'success',
            data: {
                Order: updatedOrder,
            },
        });
    } catch (err: any) {
        next(err);
    }
};


export const deleteOrderHandler = async (
    req: Request<DeleteOrderInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const Order = await getOrder(req.params.OrderId);

        if (!Order) {
            return next(new AppError(404, 'Order with that ID not found'));
        }

        await Order.remove();

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err: any) {
        next(err);
    }
};
